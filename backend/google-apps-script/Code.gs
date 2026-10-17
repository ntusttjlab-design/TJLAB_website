// 新榜單獨立存放；舊分頁只讀取符合元素規則的紀錄，不清除或覆寫。
const RECORD_SPREADSHEET='1DyZMK0cQe0eMIpvAofCX-JpzEL4nQxKDzsjSVEcpiUw';
const RECORD_SHEET='MSMTJL_Leaderboard';
const LEGACY_RECORD_SHEET='MSMTJL_Records';
const RECORD_LIMIT=5;
const RECORD_RULES={snake:'snake-elements-v1',rally:'rally-elements-v1'};
const RECORD_CACHE='records-v4';
function doGet(e){const page=HtmlService.createTemplateFromFile('Arcade');page.initialLanguage=e&&e.parameter.lang==='en'?'en':'zh-TW';return page.evaluate().setTitle('MSMTJL · 元素遊戲').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);}
function recordsRead(){
 const cache=CacheService.getScriptCache(),cached=cache.get(RECORD_CACHE);if(cached)return JSON.parse(cached);
 const result={records:currentRows_(SpreadsheetApp.openById(RECORD_SPREADSHEET))};
 cache.put(RECORD_CACHE,JSON.stringify(result),20);return result;
}
function recordSubmit(payload){
 if(!payload||!['snake','rally'].includes(payload.game))throw new Error('不支援的遊戲');
 if(payload.rules_version!==RECORD_RULES[payload.game])throw new Error('遊戲版本已更新，請重新整理後再遊玩');
 const name=String(payload.nickname||'').trim(),score=Number(payload.score),duration=Number(payload.duration_ms);
 if(!/^[A-Za-z0-9\u3400-\u9fff][A-Za-z0-9\u3400-\u9fff ._-]{0,19}$/.test(name))throw new Error('暱稱需為1至20字的中英文字或數字');
 if(!Number.isInteger(duration)||duration<65||duration>7200000)throw new Error('時間格式不符');
 if(payload.game==='snake'&&(!Number.isInteger(score)||score<1||score>118||score>Math.floor(duration/65)))throw new Error('分數格式不符');
 if(payload.game==='rally'&&(score!==5||duration<5000))throw new Error('需完成獲勝局');
 const lock=LockService.getScriptLock();lock.waitLock(5000);
 try{
  const book=SpreadsheetApp.openById(RECORD_SPREADSHEET),current=currentRows_(book);
  const candidate={game:payload.game,nickname:name,score,duration_ms:duration,date:new Date().toISOString(),rules_version:payload.rules_version};
  const ranked=current.filter(row=>row.game===payload.game).concat(candidate).sort(compare_(payload.game)).slice(0,RECORD_LIMIT);
  const saved=ranked.includes(candidate);
  if(saved){
   let sheet=book.getSheetByName(RECORD_SHEET);
   if(!sheet){sheet=book.insertSheet(RECORD_SHEET);setupSheet_(sheet);}
   writeRows_(sheet,current.filter(row=>row.game!==payload.game).concat(ranked));
   SpreadsheetApp.flush();CacheService.getScriptCache().remove(RECORD_CACHE);
  }
  return {saved,records:currentRows_(book)};
 }finally{lock.releaseLock();}
}
function currentRows_(book){
 const sheet=book.getSheetByName(RECORD_SHEET)||book.getSheetByName(LEGACY_RECORD_SHEET);
 return sheet?rows_(sheet):[];
}
function setupSheet_(sheet){
 sheet.getRange(1,1,1,6).setValues([['game_id','nickname','score','duration_ms','recorded_at','rules_version']]);
 sheet.setFrozenRows(1);[110,160,90,120,190,180].forEach((width,index)=>sheet.setColumnWidth(index+1,width));sheet.setRowHeights(1,11,30);
}
function compare_(game){return(a,b)=>game==='snake'?(b.score-a.score||a.date.localeCompare(b.date)):(a.duration_ms-b.duration_ms||a.date.localeCompare(b.date));}
function writeRows_(sheet,records){
 const ordered=['snake','rally'].flatMap(game=>records.filter(row=>row.game===game).sort(compare_(game)).slice(0,RECORD_LIMIT));
 sheet.getRange(2,1,10,6).clearContent();
 if(ordered.length)sheet.getRange(2,1,ordered.length,6).setValues(ordered.map(row=>[row.game,row.nickname,row.score,row.duration_ms,row.date,row.rules_version]));
}
function rows_(sheet){
 return sheet.getRange(2,1,10,6).getValues().filter(row=>['snake','rally'].includes(row[0])&&row[1]&&row[5]===RECORD_RULES[row[0]])
 .map(row=>({game:row[0],nickname:String(row[1]),score:Number(row[2]),duration_ms:Number(row[3]),date:row[4] instanceof Date?row[4].toISOString():String(row[4]),rules_version:String(row[5])}))
 .sort((a,b)=>a.game.localeCompare(b.game)||compare_(a.game)(a,b));
}
