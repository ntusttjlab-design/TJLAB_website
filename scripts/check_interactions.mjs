// 以可控制的時鐘驗證實際遊戲腳本，不需要安裝瀏覽器或套件。
import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = await fs.readFile(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const elements = await fs.readFile(new URL('../assets/js/elements.js', import.meta.url), 'utf8');
function setup(saved = new Map(), denyStorage = false) {
  const events = {}, intervals = new Map(), frames = new Map(), renderedText = [];
  let timerId = 0;
  const drawing = new Proxy({}, {get:(_,key)=>key==='fillText'?text=>renderedText.push(text):()=>{},set:()=>true});
  const element = (dataset = {}) => ({dataset,textContent:'',attributes:{},handlers:{},addEventListener(name,fn){this.handlers[name]=fn;},setAttribute(key,value){this.attributes[key]=value;},getContext(){return drawing;},focus(){},click(){this.handlers.click?.();}});
  const nodes = new Map();
  const get = id => {if (!nodes.has(id)) nodes.set(id,element());return nodes.get(id);};
  const directions = ['up','down','left','right'].map(direction=>element({direction}));
  const context = vm.createContext({
    console,Event,performance:{now:()=>0},Math:Object.assign(Object.create(Math),{random:()=>0}),
    localStorage:{getItem:key=>{if(denyStorage)throw Error('blocked');return saved.get(key)??null;},setItem:(key,value)=>{if(denyStorage)throw Error('blocked');saved.set(key,value);}},
    document:{hidden:false,getElementById:get,querySelectorAll:selector=>selector==='[data-direction]'?directions:[],addEventListener(name,fn){(events[name]??=[]).push(fn);}},
    window:{addEventListener(name,fn){(events[name]??=[]).push(fn);}},
    setInterval(fn){const id=++timerId;intervals.set(id,fn);return id;},clearInterval(id){intervals.delete(id);},requestAnimationFrame(fn){const id=++timerId;frames.set(id,fn);return id;},cancelAnimationFrame(id){frames.delete(id);}
  });
  vm.runInContext(elements+'\n'+source,context);
  assert.equal(context.window.labElements.length,118);
  assert.equal(new Set(context.window.labElements.map(item=>item[0])).size,118);
  assert.equal(context.window.labElements[117][0],'Og');
  vm.runInContext('initSnake(); initRally();',context);
  let elapsed=0;
  return {get,directions,saved,renderedText,tick(count){for(let i=0;i<count;i++) [...intervals.values()].forEach(fn=>fn());},animate(count){for(let i=0;i<count;i++){elapsed+=16;const active=[...frames.values()];frames.clear();active.forEach(fn=>fn(elapsed));}},events};
}
const test = setup();
test.get('snake-start-btn').click();
assert.equal(test.get('snake-dp-score').textContent,0);
test.directions[0].click();test.tick(10);
test.directions[2].click();test.tick(10);
assert.equal(test.get('snake-dp-score').textContent,1,'吃到氫後收集數應增加');
assert.equal(test.get('snake-next').textContent.includes('He'),true,'下一個元素應依原子序前進');
assert.equal(test.saved.get('msmtjl_element_snake_high'),'1','新版元素最高分應獨立保存');
test.tick(1);
assert.match(test.get('snake-status').textContent,/本局結束/,'撞牆應結束');
test.get('snake-start-btn').click();
test.get('snake-pause-btn').click();
test.tick(20);
assert.match(test.get('snake-status').textContent,/已暫停/);
test.get('snake-pause-btn').click();
test.get('volley-start-btn').click();
assert.match(test.get('snake-status').textContent,/已暫停/,'另一個遊戲開始時應暫停貪食蛇');
test.events.blur.forEach(fn=>fn());
assert.match(test.get('volley-status').textContent,/已暫停/,'失焦應暫停彈跳球');
const restored=setup(test.saved);
assert.equal(restored.get('snake-high-score').textContent,1,'重新初始化應還原新版最高分');
const restricted=setup(new Map(),true);
restricted.get('snake-start-btn').click();restricted.directions[0].click();restricted.tick(10);restricted.directions[2].click();restricted.tick(10);
assert.equal(restricted.get('snake-dp-score').textContent,1,'禁止儲存時仍能遊玩');
assert.match(restricted.get('snake-status').textContent,/不允許儲存/);
const rally=setup();
rally.get('volley-start-btn').click();rally.animate(12000);
assert.equal(rally.get('volley-score-ai').textContent,5,'先得五分應結束比賽');
assert.match(rally.get('volley-status').textContent,/AI 獲勝/);
assert.equal(rally.renderedText.at(-1),'AI WINS','結束畫面不能被下一幀覆蓋');
const elementsRound=setup();
elementsRound.get('volley-start-btn').click();
assert.match(elementsRound.get('rally-element').textContent,/H · 氫/);
elementsRound.get('volley-pause-btn').click();elementsRound.get('volley-pause-btn').click();
assert.match(elementsRound.get('rally-element').textContent,/H · 氫/,'暫停不應換元素');
elementsRound.get('volley-start-btn').click();
assert.match(elementsRound.get('rally-element').textContent,/He · 氦/,'新局才切換下一個元素');
console.log('PASS：進食、撞牆、暫停／恢復、遊戲互斥、失焦暫停、最高分保存與還原、儲存受限、彈跳球五分結束與結束畫面。');
