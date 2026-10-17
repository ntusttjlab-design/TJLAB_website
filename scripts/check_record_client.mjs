// 驗證真正的榜單客戶端：進榜資格、送出後讀回，以及服務失敗時可繼續遊戲。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const nodes=new Map(),calls=[],timers=new Map();let timerId=0,paused=0;
function node(){return {textContent:'',value:'',disabled:false,open:false,children:[],handlers:{},append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},showModal(){this.open=true;},close(){this.open=false;},addEventListener(type,handler){this.handlers[type]=handler;}};}
const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
const runner={withSuccessHandler(fn){this.success=fn;return this;},withFailureHandler(fn){this.failure=fn;return this;},recordsRead(){calls.push({method:'read',success:this.success,failure:this.failure});},recordSubmit(payload){calls.push({method:'submit',payload,success:this.success,failure:this.failure});}};
const context=vm.createContext({console,Date,JSON,Number,language:'zh-TW',localized:(zh)=>zh,storage:{get:()=>'',set(){}},gameControllers:{snake:{pause(){paused++;}}},window:{},document:{getElementById:get,createElement:node,addEventListener(){}},google:{script:{run:runner}},setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout(id){timers.delete(id);}});
vm.runInContext(fs.readFileSync(new URL('../backend/google-apps-script/record-client.js',import.meta.url),'utf8'),context);
const board=[118,100,90,80,70].map((score,index)=>({game:'snake',nickname:'玩家'+index,score,duration_ms:10000,date:'2026-10-17T00:00:00Z',rules_version:'snake-elements-v1'}));
calls.shift().success({records:board});
context.window.labRecord({game:'snake',score:70,duration_ms:10000});assert.equal(get('record-dialog').open,false,'榜單滿額時同分後到不得詢問暱稱');
context.window.labRecord({game:'snake',score:71,duration_ms:10000});assert.equal(get('record-dialog').open,true);
get('record-name').value='新玩家';get('record-form').handlers.submit({preventDefault(){}});
const submission=calls.shift();assert.equal(submission.method,'submit');assert.equal(submission.payload.nickname,'新玩家');assert.equal(submission.payload.score,71);
submission.success({saved:true,records:board});assert.equal(get('record-dialog').open,false);assert.match(get('record-status').textContent,/前五名/);
get('record-retry').handlers.click();calls.shift().failure();assert.match(get('record-status').textContent,/遊戲仍可繼續/);assert.equal(get('record-submit').disabled,false);
get('record-retry').handlers.click();for(const fn of [...timers.values()])fn();assert.match(get('record-status').textContent,/逾時/);
assert.equal(paused,1,'讀榜失敗不得暫停遊戲');
console.log('PASS：進榜才詢問、同分資格、暱稱提交與讀回、失敗／逾時不影響遊戲。');
