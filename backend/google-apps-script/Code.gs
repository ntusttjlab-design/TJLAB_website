// 僅維護指定試算表的兩筆最高紀錄；不讀取原工作表或舊送審資料。
const RECORD_SPREADSHEET = '1DyZMK0cQe0eMIpvAofCX-JpzEL4nQxKDzsjSVEcpiUw';
function doGet(e) {
  const page=HtmlService.createTemplateFromFile('Arcade');
  page.initialLanguage=e && e.parameter.lang==='en'?'en':'zh-TW';
  return page.evaluate().setTitle('MSMTJL · 研究之餘').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function recordsRead() {
  const cached=CacheService.getScriptCache().get('records-v2');
  if(cached)return JSON.parse(cached);
  const sheet=SpreadsheetApp.openById(RECORD_SPREADSHEET).getSheetByName('MSMTJL_Records');
  const result={records:sheet?rows_(sheet):[]};
  CacheService.getScriptCache().put('records-v2',JSON.stringify(result),20);
  return result;
}
function recordSubmit(payload) {
  if(!payload || !['snake','rally'].includes(payload.game))throw new Error('不支援的遊戲');
  const name=String(payload.nickname||'').trim(),score=Number(payload.score),duration=Number(payload.duration_ms);
  if(!/^[A-Za-z0-9\u3400-\u9fff][A-Za-z0-9\u3400-\u9fff ._-]{0,19}$/.test(name))throw new Error('暱稱需為1至20字的中英文字或數字');
  if(!Number.isInteger(duration)||duration<1000||duration>7200000)throw new Error('時間格式不符');
  if(payload.game==='snake'&&(!Number.isInteger(score)||score<4||score>600||score-3>Math.floor(duration/65)))throw new Error('分數格式不符');
  if(payload.game==='rally'&&(score!==5||duration<5000))throw new Error('需完成獲勝局');
  const lock=LockService.getScriptLock();lock.waitLock(5000);
  try {
    const book=SpreadsheetApp.openById(RECORD_SPREADSHEET);
    let sheet=book.getSheetByName('MSMTJL_Records');
    if(!sheet){sheet=book.insertSheet('MSMTJL_Records');sheet.getRange(1,1,3,6).setValues([['game_id','nickname','score','duration_ms','recorded_at','rules_version'],['snake','','','','','snake-v2'],['rally','','','','','rally-v2']]);sheet.setFrozenRows(1);sheet.setColumnWidths(1,6,170);sheet.setRowHeights(1,3,32);}
    const current=rows_(sheet).find(row=>row.game===payload.game);
    const better=!current||(payload.game==='snake'?score>current.score:duration<current.duration_ms);
    if(!better)return {saved:false,records:rows_(sheet)};
    const row=payload.game==='snake'?2:3;
    sheet.getRange(row,1,1,6).setValues([[payload.game,name,score,duration,new Date().toISOString(),payload.game+'-v2']]);
    SpreadsheetApp.flush();CacheService.getScriptCache().remove('records-v2');
    return {saved:true,records:rows_(sheet)};
  } finally {lock.releaseLock();}
}
function rows_(sheet){
  return sheet.getRange(2,1,2,6).getValues().filter(row=>['snake','rally'].includes(row[0])&&row[1]&&row[5]===row[0]+'-v2').map(row=>({game:row[0],nickname:String(row[1]),score:Number(row[2]),duration_ms:Number(row[3]),date:row[4] instanceof Date?row[4].toISOString():String(row[4])}));
}
