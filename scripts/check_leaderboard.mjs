// 驗證版本協定與分頁遷移，所有資料均為本機替身。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const sheets=new Map();let locked=false,flushes=0,writes=0;
function makeSheet(name){
 const table=Array.from({length:11},()=>Array(6).fill(''));
 const sheet={table,setFrozenRows(){},setColumnWidth(){},setRowHeights(){},getRange(row,col,rows,cols){
  assert.equal(col,1);assert.ok(row>=1&&row+rows-1<=11);assert.equal(cols,6);
  return {getValues:()=>table.slice(row-1,row-1+rows).map(x=>[...x]),clearContent(){assert.ok(locked);assert.equal(name,'MSMTJL_Leaderboard');writes++;for(let i=0;i<rows;i++)table[row-1+i]=Array(6).fill('');},setValues(values){assert.ok(locked);assert.equal(name,'MSMTJL_Leaderboard');writes++;values.forEach((value,i)=>table[row-1+i]=[...value]);}};
 }};sheets.set(name,sheet);return sheet;
}
const legacy=makeSheet('MSMTJL_Records');
legacy.table[1]=['snake','舊版DP',99,9000,'2025-01-01T00:00:00.000Z','snake-v2'];
legacy.table[2]=['snake','既有元素玩家',2,9000,'2026-01-01T00:00:00.000Z','snake-elements-v1'];
const original=JSON.stringify(legacy.table);
const book={getSheetByName:name=>sheets.get(name)||null,insertSheet(name){assert.equal(name,'MSMTJL_Leaderboard');return makeSheet(name);}};
const context=vm.createContext({Date,JSON,CacheService:{getScriptCache:()=>({get:()=>null,put(){},remove(){}})},LockService:{getScriptLock:()=>({waitLock(){assert.equal(locked,false);locked=true;},releaseLock(){locked=false;}})},SpreadsheetApp:{openById(id){assert.equal(id,'1DyZMK0cQe0eMIpvAofCX-JpzEL4nQxKDzsjSVEcpiUw');return book;},flush(){flushes++;}}});
vm.runInContext(fs.readFileSync(new URL('../backend/google-apps-script/Code.gs',import.meta.url),'utf8'),context);
assert.equal(context.recordsRead().records.length,1);
assert.equal(context.recordsRead().records[0].nickname,'既有元素玩家');
const submit=(game,score,duration_ms,nickname='玩家',rules_version=game+'-elements-v1')=>context.recordSubmit({game,score,duration_ms,nickname,rules_version});
assert.throws(()=>submit('snake',4,4000,'舊客戶端','snake-v2'),/版本/);
assert.throws(()=>context.recordSubmit({game:'snake',score:4,duration_ms:4000,nickname:'無版本'}),/版本/);
assert.equal(sheets.has('MSMTJL_Leaderboard'),false,'拒絕舊客戶端不得建立或改寫分頁');
assert.equal(writes,0);
assert.equal(submit('snake',3,10000,'蛇3').saved,true);
assert.equal(context.recordsRead().records.some(row=>row.nickname==='既有元素玩家'),true,'首次提交應帶入原本合法元素紀錄');
for(let score=4;score<=8;score++)assert.equal(submit('snake',score,10000,'蛇'+score).saved,true);
assert.deepEqual(context.recordsRead().records.filter(row=>row.game==='snake').map(row=>row.score),[8,7,6,5,4]);
assert.equal(submit('snake',4,9000,'同分後到').saved,false);
for(const [index,duration] of [60000,50000,40000,30000,20000,10000].entries())assert.equal(submit('rally',5,duration,'球'+index).saved,true);
assert.deepEqual(context.recordsRead().records.filter(row=>row.game==='rally').map(row=>row.duration_ms),[10000,20000,30000,40000,50000]);
assert.equal(context.recordsRead().records.length,10);
assert.equal(JSON.stringify(legacy.table),original,'舊表及舊DP資料應完整保留');
assert.throws(()=>submit('snake',119,10000));
assert.throws(()=>submit('rally',4,35000));
assert.throws(()=>submit('unknown',5,35000));
assert.throws(()=>submit('snake',5,9000,'=IMPORTXML'));
assert.equal(locked,false);assert.equal(flushes,12);
console.log('PASS：缺少或錯誤版本拒絕、舊表唯讀保留、合法成績遷移、各五名排序及同分先到。');
