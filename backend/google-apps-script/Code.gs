// 每款遊戲保留五筆新版紀錄；由伺服器排序並以鎖避免同時寫入衝突。
const RECORD_SPREADSHEET = '1DyZMK0cQe0eMIpvAofCX-JpzEL4nQxKDzsjSVEcpiUw';
const RECORD_SHEET = 'MSMTJL_Records';
const RECORD_LIMIT = 5;
const RECORD_RULES = {snake:'snake-elements-v1',rally:'rally-elements-v1'};
function doGet(e){const page=HtmlService.createTemplateFromFile('Arcade');page.initialLanguage=e&&e.parameter.lang==='en'?'en':'zh-TW';return page.evaluate().setTitle('MSMTJL · 研究之餘').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);}
function recordsRead(){const cache=CacheService.getScriptCache(),cached=cache.get('records-v3');if(cached)return JSON.parse(cached);const sheet=SpreadsheetApp.openById(RECORD_SPREADSHEET).getSheetByName(RECORD_SHEET),result={records:sheet?rows_(sheet):[]};cache.put('records-v3',JSON.stringify(result),20);return result;}
function recordSubmit(payload){
 if(!payload||!['snake','rally'].includes(payload.game))throw new Error('不支援的遊戲');
 const name=String(payload.nickname||'').trim(),score=Number(payload.score),duration=Number(payload.duration_ms);
 if(!/^[A-Za-z0-9\u3400-\u9fff][A-Za-z0-9\u3400-\u9fff ._-]{0,19}$/.test(name))throw new Error('暱稱需為1至20字的中英文字或數字');
 if(!Number.isInteger(duration)||duration<65||duration>7200000)throw new Error('時間格式不符');
 if(payload.game==='snake'&&(!Number.isInteger(score)||score<1||score>118||score>Math.floor(duration/65)+1))throw new Error('分數格式不符');
 if(payload.game==='rally'&&(score!==5||duration<5000))throw new Error('需完成獲勝局');
 const lock=LockService.getScriptLock();lock.waitLock(5000);
 try{
  const book=SpreadsheetApp.openById(RECORD_SPREADSHEET);let sheet=book.getSheetByName(RECORD_SHEET);if(!sheet){sheet=book.insertSheet(RECORD_SHEET);setupSheet_(sheet);}else formatSheet_(sheet);
  const current=rows_(sheet),candidate={game:payload.game,nickname:name,score,duration_ms:duration,date:new Date().toISOString(),rules_version:RECORD_RULES[payload.game]};
  const ranked=current.filter(row=>row.game===payload.game).concat(candidate).sort(compare_(payload.game)).slice(0,RECORD_LIMIT),saved=ranked.includes(candidate);
  if(saved){writeRows_(sheet,current.filter(row=>row.game!==payload.game).concat(ranked));SpreadsheetApp.flush();CacheService.getScriptCache().remove('records-v3');}
  return {saved,records:rows_(sheet)};
 }finally{lock.releaseLock();}
}
function setupSheet_(sheet){sheet.getRange(1,1,1,6).setValues([['game_id','nickname','score','duration_ms','recorded_at','rules_version']]);formatSheet_(sheet);}
function formatSheet_(sheet){sheet.setFrozenRows(1);[110,160,90,120,190,180].forEach((width,index)=>sheet.setColumnWidth(index+1,width));sheet.setRowHeights(1,11,30);}
function compare_(game){return (a,b)=>game==='snake'?(b.score-a.score||a.date.localeCompare(b.date)):(a.duration_ms-b.duration_ms||a.date.localeCompare(b.date));}
function writeRows_(sheet,records){const ordered=['snake','rally'].flatMap(game=>records.filter(row=>row.game===game).sort(compare_(game)).slice(0,RECORD_LIMIT)),range=sheet.getRange(2,1,10,6);range.clearContent();if(ordered.length)sheet.getRange(2,1,ordered.length,6).setValues(ordered.map(row=>[row.game,row.nickname,row.score,row.duration_ms,row.date,row.rules_version]));}
function rows_(sheet){return sheet.getRange(2,1,10,6).getValues().filter(row=>RECORD_RULES[row[0]]&&row[1]&&row[5]===RECORD_RULES[row[0]]).map(row=>({game:row[0],nickname:String(row[1]),score:Number(row[2]),duration_ms:Number(row[3]),date:row[4] instanceof Date?row[4].toISOString():String(row[4]),rules_version:String(row[5])})).sort((a,b)=>a.game.localeCompare(b.game)||compare_(a.game)(a,b));}
