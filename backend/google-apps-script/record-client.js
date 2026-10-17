// 與遊戲在同一個 Apps Script 頁面，直接使用官方通道。
let records=[],recordReady=false,pendingRecord=null,request=0;
const recordStatus=document.getElementById('record-status');
const recordDialog=document.getElementById('record-dialog');
function renderRecords(){
 document.getElementById('record-list').replaceChildren();
 ['snake','rally'].forEach(game=>{const winner=records.find(row=>row.game===game),line=document.createElement('p');line.textContent=localized(game==='snake'?'分子貪食蛇':'彈跳球最快獲勝',game==='snake'?'Molecular snake':'Fastest rally win')+' · '+(winner?winner.nickname+' · '+(game==='snake'?winner.score+' DP':(winner.duration_ms/1000).toFixed(2)+' s')+' · '+new Date(winner.date).toLocaleString(language==='en'?'en-GB':'zh-TW',{timeZone:'Asia/Taipei',hour12:false}):localized('尚無紀錄','No record yet'));document.getElementById('record-list').append(line);});
}
function recordCall(method,payload,success){
 const ticket=++request;const timer=setTimeout(()=>{if(ticket===request){request++;recordStatus.textContent=localized('共用紀錄連線逾時，可稍後重試。','Records timed out. Please retry.');document.getElementById('record-submit').disabled=false;}},15000);
 const runner=google.script.run.withSuccessHandler(result=>{if(ticket!==request)return;clearTimeout(timer);success(result);}).withFailureHandler(()=>{if(ticket!==request)return;clearTimeout(timer);recordStatus.textContent=localized('共用紀錄暫時無法讀寫，遊戲仍可繼續。','Shared records are unavailable. You can still play.');document.getElementById('record-submit').disabled=false;});
 if(method==='read')runner.recordsRead();else runner.recordSubmit(payload);
}
function loadRecords(){recordCall('read',null,result=>{records=result.records;recordReady=true;renderRecords();recordStatus.textContent=localized('貪食蛇比最高 DP；彈跳球比獲勝局遊戲時間。紀錄時間為台灣時間。','Highest snake DP; shortest winning rally game time. Dates shown in Taiwan time.');});}
window.labRecord=payload=>{
 if(!recordReady||recordDialog.open)return;
 const best=records.find(row=>row.game===payload.game);
 if(payload.game==='snake'&&(payload.score<4||best&&payload.score<=best.score)||payload.game==='rally'&&(payload.duration_ms<5000||best&&payload.duration_ms>=best.duration_ms))return;
 Object.values(gameControllers).forEach(game=>game.pause());pendingRecord=payload;
 document.getElementById('record-name').value=storage.get('msmtjl_nickname','');document.getElementById('record-submit').disabled=false;document.getElementById('record-form-status').textContent='';recordDialog.showModal();
};
document.getElementById('record-cancel').addEventListener('click',()=>recordDialog.close());
document.getElementById('record-form').addEventListener('submit',event=>{
 event.preventDefault();if(!pendingRecord)return;
 const nickname=document.getElementById('record-name').value.trim();
 if(!/^[A-Za-z0-9\u3400-\u9fff][A-Za-z0-9\u3400-\u9fff ._-]{0,19}$/.test(nickname)){document.getElementById('record-form-status').textContent=localized('請填1至20字的中英文字或數字。','Use 1–20 letters or numbers.');return;}
 document.getElementById('record-submit').disabled=true;
 recordCall('submit',{...pendingRecord,nickname},result=>{records=result.records;storage.set('msmtjl_nickname',nickname);renderRecords();recordStatus.textContent=result.saved?localized('最高紀錄已儲存！','New record saved!'):localized('已有更佳或相同紀錄，已顯示最新冠軍。','An equal or better record exists. Showing the latest champion.');pendingRecord=null;recordDialog.close();});
});
document.getElementById('record-retry').addEventListener('click',loadRecords);
document.addEventListener('languagechange',renderRecords);
loadRecords();
