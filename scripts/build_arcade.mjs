// 封裝既有遊戲到 Apps Script，維持同一份遊戲程式。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const begin=html.indexOf('<div class="games-grid">');
const end=html.indexOf('</div></section>',begin);
if(begin<0||end<0)throw Error('找不到遊戲區');
const cards=html.slice(begin,end+6);
const source=fs.readFileSync(path.join(root,'assets/js/main.js'),'utf8');
const games=source.slice(source.indexOf('function initSnake()'));
const bridge=fs.readFileSync(path.join(root,'backend/google-apps-script/record-client.js'),'utf8');
const page=`<!doctype html><html lang="<?= initialLanguage ?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{box-sizing:border-box}body{margin:0;font:14px/1.65 system-ui,"Microsoft JhengHei",sans-serif;background:#f6f8f5;color:#19332f}button,input{font:inherit}button{cursor:pointer;min-height:44px}button:focus-visible,input:focus-visible,canvas:focus-visible{outline:3px solid #a66025;outline-offset:3px}header{display:flex;justify-content:space-between;gap:12px;align-items:center}h2{font-size:22px}h3{margin:0;font-size:17px}p{color:#526660}button,.button,input{border:1px solid #cbd9cc;border-radius:8px;background:white;padding:8px 12px;color:#19332f}.primary{background:#17654e;color:white}#record-list{font-size:13px}#record-list p{margin:5px 0}.games-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0}.game-card{border:1px solid #d9e3dc;border-radius:18px;padding:18px;background:white;min-width:0}.game-heading{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between}.game-card canvas{width:100%;height:auto;display:block;touch-action:none;border-radius:10px}.game-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.direction-controls{display:flex;gap:4px}.direction-controls button{padding:6px 12px}.game-card p{font-size:12px;min-height:40px}dialog{max-width:360px;width:calc(100% - 32px);border:1px solid #d9e3dc;border-radius:16px;padding:24px}dialog::backdrop{background:#19332f66}dialog input{width:100%;margin:10px 0}dialog form>div{display:flex;gap:10px}#record-status{font-size:12px}#record-retry{font-size:12px}#record-language{font-size:12px}@media(max-width:700px){.games-grid{grid-template-columns:1fr}.game-card{padding:14px}}
</style></head><body><header><h2 data-zh="共用最高紀錄" data-en="Shared records">共用最高紀錄</h2><button id="record-language">EN</button></header><div id="record-list"></div><p id="record-status" role="status" aria-live="polite">讀取最高紀錄…</p><button id="record-retry" data-zh="重新讀取紀錄" data-en="Refresh records">重新讀取紀錄</button>${cards}<dialog id="record-dialog"><form id="record-form"><h2 data-zh="挑戰最高紀錄！" data-en="A new record contender!">挑戰最高紀錄！</h2><label for="record-name" data-zh="顯示在公開紀錄上的暱稱" data-en="Nickname shown on the public record">顯示在公開紀錄上的暱稱</label><input id="record-name" maxlength="20" autocomplete="nickname" required><p id="record-form-status" role="status"></p><div><button id="record-submit" class="primary" type="submit" data-zh="送出紀錄" data-en="Submit record">送出紀錄</button><button id="record-cancel" type="button" data-zh="略過" data-en="Skip">略過</button></div></form></dialog><script>
'use strict';
let language=document.documentElement.lang==='en'?'en':'zh-TW';
const gameControllers={};
const localized=(zh,en)=>language==='en'?en:zh;
const storage={get(key,fallback){try{return localStorage.getItem(key)??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem(key,value);return true;}catch{return false;}}};
function activateGame(name){Object.entries(gameControllers).forEach(([key,game])=>{if(key!==name)game.pause();});}
function setLanguage(){document.documentElement.lang=language;document.querySelectorAll('[data-zh][data-en]').forEach(node=>{node.textContent=language==='en'?node.dataset.en:node.dataset.zh;});document.getElementById('record-language').textContent=language==='en'?'繁中':'EN';document.dispatchEvent(new Event('languagechange'));}
${games}
initSnake();initRally();
document.getElementById('record-language').addEventListener('click',()=>{language=language==='en'?'zh-TW':'en';setLanguage();});
${bridge}
setLanguage();
</script></body></html>`;
fs.writeFileSync(path.join(root,'backend/google-apps-script/Arcade.html'),page);
console.log('已由網站遊戲原始碼產生 Apps Script Arcade.html。');
