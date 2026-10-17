'use strict';

// 語言、搜尋與遊戲狀態共用事件，切換語言時不重置進度。
let language = 'zh-TW';
const gameControllers = {};
const localized = (zh, en) => language === 'en' ? en : zh;
const storage = {
    get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
};
function activateGame(name) {
    Object.entries(gameControllers).forEach(([key, controller]) => { if (key !== name) controller.pause(); });
}
function setLanguage(next) {
    language = next === 'en' ? 'en' : 'zh-TW';
    document.documentElement.lang = language;
    document.querySelectorAll('[data-zh][data-en]').forEach(element => {
        element.textContent = language === 'en' ? element.dataset.en : element.dataset.zh;
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(element => {
        element.dataset.zhPlaceholder ??= element.placeholder;
        element.placeholder = language === 'en' ? element.dataset.enPlaceholder : element.dataset.zhPlaceholder;
    });
    const button = document.getElementById('language-toggle');
    button.textContent = language === 'en' ? '繁中' : 'EN';
    button.setAttribute('aria-label', language === 'en' ? '切換為繁體中文' : 'Switch language to English');
    storage.set('msmtjl_language', language);
    document.dispatchEvent(new Event('languagechange'));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('language-toggle').addEventListener('click', () => setLanguage(language === 'en' ? 'zh-TW' : 'en'));
    const nav = document.getElementById('site-nav');
    const menu = document.getElementById('mobile-menu-btn');
    menu.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false');
        if (link.hash !== '#arcade') Object.values(gameControllers).forEach(game => game.pause());
    }));
    document.addEventListener('focusin', event => {
        if (event.target.closest('input,textarea,[contenteditable]')) Object.values(gameControllers).forEach(game => game.pause());
    });
    initPublications();
    initTerminal();
    initSnake();
    initRally();
    setLanguage(storage.get('msmtjl_language', 'zh-TW'));
    // 外部 3D 服務失敗時，保留靜態分子示意及其餘功能。
    try {
        if (typeof THREE !== 'undefined' && typeof initThreeJsMolecule === 'function') {
            initThreeJsMolecule();
            document.getElementById('molecule-fallback').hidden = true;
        }
    } catch {
        document.querySelector('#molecule-canvas canvas')?.remove();
        document.getElementById('molecule-fallback').hidden = false;
    }
});

function initPublications() {
    const cards = [...document.querySelectorAll('.pub-card')].sort((a,b)=>Number(b.querySelector('.pub-year').textContent)-Number(a.querySelector('.pub-year').textContent));
    document.getElementById('publication-list').replaceChildren(...cards);
    const search = document.getElementById('pub-search-input');
    const tabs = [...document.querySelectorAll('[data-filter]')];
    let filter = 'all', expanded = false;
    const more = document.getElementById('pub-more');
    // 索引同時收錄中英文，語言切換後仍可搜尋另一種語言。
    const indexes = cards.map(card => {
        const translations = [...card.querySelectorAll('[data-en]')].map(node => node.dataset.en + ' ' + node.dataset.zh).join(' ');
        return (card.textContent + ' ' + translations).toLocaleLowerCase();
    });
    function apply() {
        const query = search.value.trim().toLocaleLowerCase();
        let count = 0, visibleCount = 0;
        cards.forEach((card, index) => {
            const match = (filter === 'all' || card.dataset.category.split(' ').includes(filter)) && indexes[index].includes(query);
            const show = match && (expanded || query || filter !== 'all' || index < 12);
            card.hidden = !show;
            if (match) count++;
            if (show) visibleCount++;
        });
        more.hidden = Boolean(query || filter !== 'all');
        more.textContent = expanded ? localized('只看近期成果','Show recent results') : localized('查看全部成果','View all publications');
        more.setAttribute('aria-expanded', String(expanded));
        document.getElementById('pub-count-display').textContent = localized(`顯示 ${visibleCount} / ${count} 筆紀錄`, `Showing ${visibleCount} of ${count} records`);
        document.getElementById('pub-empty').hidden = count !== 0;
        document.dispatchEvent(new Event('publicationschange'));
    }
    search.addEventListener('input', apply);
    tabs.forEach(tab => tab.addEventListener('click', () => {
        filter = tab.dataset.filter;
        tabs.forEach(item => item.setAttribute('aria-pressed', String(item === tab)));
        apply();
    }));
    more.addEventListener('click',()=>{expanded=!expanded;apply();});
    document.addEventListener('languagechange', apply);
    apply();
}

function initTerminal() {
    const dialog = document.getElementById('terminal-modal');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const open = () => { Object.values(gameControllers).forEach(game => game.pause()); if (!dialog.open) dialog.showModal(); input.focus(); };
    document.getElementById('open-terminal-btn').addEventListener('click', open);
    document.getElementById('close-terminal-btn').addEventListener('click', () => dialog.close());
    document.addEventListener('keydown', event => {
        if ((event.key === '~' || event.key === '`') && !event.target.closest('input,textarea,[contenteditable]')) { event.preventDefault(); open(); }
    });
    document.getElementById('terminal-form').addEventListener('submit', event => {
        event.preventDefault();
        const raw = input.value.trim(); input.value = '';
        if (!raw) return;
        const command = raw.toLowerCase();
        if (command === 'clear') { output.textContent = ''; return; }
        if (command === 'exit') { dialog.close(); return; }
        let result;
        switch (command) {
            case 'help': result = 'help · cat pi.txt · skills · run_md · play · join · clear · exit'; break;
            case 'cat pi.txt': result = '林子仁 / Tzu-Jen Lin\nNTUST · Materials Science and Engineering\nOffice E1-101-2 · Lab E1-241-2\ntjlin@mail.ntust.edu.tw'; break;
            case 'skills': result = 'DFT / Gaussian / CP2K / xTB / CASTEP\nMD / LAMMPS / GROMACS / Materials Studio\nPython / NumPy / RDKit / scikit-learn / Bash'; break;
            case 'run_md': result = localized('示意輸出，未執行真實模擬：\nStep 0 → 250 → 500 → 1000\nTemperature ≈ 298 K', 'Illustrative output only; no simulation was executed:\nStep 0 → 250 → 500 → 1000\nTemperature ≈ 298 K'); break;
            case 'play': case 'join': dialog.close(); document.getElementById(command === 'play' ? 'arcade' : 'join').scrollIntoView(); return;
            default: result = localized('找不到此指令，請輸入 help。', 'Unknown command. Type help.');
        }
        // 使用純文字插入，避免把輸入內容當成 HTML 執行。
        output.textContent += `$ ${raw}\n${result}\n\n`;
        output.scrollTop = output.scrollHeight;
    });
}

function initSnake() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('snake-status');
    const pauseButton = document.getElementById('snake-pause-btn');
    const elements=window.labElements, step = 30, cols = 20, rows = 14;
    let snake, food, collected, direction, nextDirection, changed = false, phase = 'idle', timer, activeMs = 0;
    let best = Math.max(0, Number(storage.get('msmtjl_element_snake_high', '0')) || 0);
    let canSave = true;
    const directions = {up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
    function reset() { activeMs = 0; collected=[];snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}]; direction = nextDirection = directions.right; changed = false; spawn(); }
    function spawn() {
        const empty = [];
        for (let y=0;y<rows;y++) for(let x=0;x<cols;x++) if (!snake.some(part => part.x===x && part.y===y)) empty.push({x,y});
        food = empty.length && collected.length<elements.length ? empty[Math.floor(Math.random()*empty.length)] : null;
    }
    function announce() {
        document.getElementById('snake-dp-score').textContent = collected.length;
        document.getElementById('snake-high-score').textContent = best;
        const next=elements[collected.length];
        document.getElementById('snake-next').textContent=next?localized(`下一個：${next[0]} · ${next[2]}（原子序 ${collected.length+1}）`,`Next: ${next[0]} · ${next[1]} (atomic no. ${collected.length+1})`):localized('118 種元素收集完成','All 118 elements collected');
        document.getElementById('element-collection-grid').textContent=collected.map((item,index)=>`${index+1} ${item[0]}`).join(' · ');
        pauseButton.setAttribute('aria-pressed', String(phase === 'paused'));
        const messages = {idle:['按開始新局，或先看看其他研究內容。','Press New game when you are ready.'],running:['依原子序收集元素，挑戰自己的紀錄！','Collect elements in atomic-number order!'],paused:['已暫停。','Paused.'],over:['本局結束，按開始新局再試一次。','Game over. Press New game to try again.'],won:['118 種元素收集完成！','All 118 elements collected!']};
        status.textContent = localized(...messages[phase]) + (canSave ? '' : localized(' 瀏覽器不允許儲存紀錄。', ' This browser cannot save the record.'));
    }
    function draw() {
        ctx.fillStyle='#171d21';ctx.fillRect(0,0,600,420);ctx.textAlign='center';ctx.textBaseline='middle';
        snake.forEach((part,index)=>{ctx.fillStyle=index===0?'#dce9e3':'#4f766b';ctx.beginPath();ctx.roundRect?.(part.x*step+2,part.y*step+2,26,26,5);ctx.fill();ctx.fillStyle=index===0?'#17332d':'#f4f2eb';ctx.font='600 14px sans-serif';ctx.fillText(collected.at(-(index+1))?.[0]||'·',part.x*step+15,part.y*step+15);});
        if(food){ctx.fillStyle='#b58b4c';ctx.beginPath();ctx.arc(food.x*step+15,food.y*step+15,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#171d21';ctx.font='700 14px sans-serif';ctx.fillText(elements[collected.length][0],food.x*step+15,food.y*step+15);}
        if(phase!=='running' && phase!=='idle'){ctx.fillStyle='rgba(23,29,33,.84)';ctx.fillRect(0,0,600,420);ctx.fillStyle='#f4f2eb';ctx.font='600 24px sans-serif';ctx.fillText(phase==='paused'?'PAUSED':phase==='won'?'118 ELEMENTS COMPLETE':'GAME OVER',300,210);}
    }
    function delay(){return Math.max(65,140-collected.length*.6);}function schedule() { clearInterval(timer); timer = setInterval(tick, delay()); }
    function tick() {
        if(phase!=='running')return;
        activeMs += delay();direction=nextDirection;changed=false;
        const head={x:snake[0].x+direction.x,y:snake[0].y+direction.y};
        const eating=food && head.x===food.x && head.y===food.y;
        // 未進食時尾端會離開原格，允許蛇頭走進該位置。
        const body=eating?snake:snake.slice(0,-1);
        if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||body.some(part=>part.x===head.x&&part.y===head.y)){phase='over';clearInterval(timer);announce();draw();if(collected.length)window.labRecord?.({game:'snake',score:collected.length,duration_ms:Math.round(activeMs)});return;}
        snake.unshift(head);
        if(eating){collected.push(elements[collected.length]);if(collected.length>best){best=collected.length;canSave=storage.set('msmtjl_element_snake_high',String(best));}spawn();if(!food){phase='won';clearInterval(timer);window.labRecord?.({game:'snake',score:collected.length,duration_ms:Math.round(activeMs)});}else schedule();}else snake.pop();
        announce();draw();
    }
    function turn(name){const next=directions[name];if(phase==='running'&&!changed&&next&&(next.x!==-direction.x||next.y!==-direction.y)){nextDirection=next;changed=true;}}
    function pause(){if(phase==='running'){phase='paused';clearInterval(timer);announce();draw();}}
    gameControllers.snake={pause};
    document.getElementById('snake-start-btn').addEventListener('click',()=>{activateGame('snake');reset();phase='running';schedule();canvas.focus({preventScroll:true});announce();draw();});
    pauseButton.addEventListener('click',()=>{if(phase==='running')pause();else if(phase==='paused'){activateGame('snake');phase='running';schedule();canvas.focus({preventScroll:true});announce();draw();}});
    document.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>turn(button.dataset.direction)));
    window.addEventListener('keydown',event=>{if(phase!=='running'||event.target.closest('input,textarea,[contenteditable]'))return;const keys={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};const name=keys[event.key]||keys[event.key.toLowerCase()];if(name){event.preventDefault();turn(name);}});
    document.addEventListener('languagechange',announce);
    reset();announce();draw();
}

function initRally() {
    const canvas=document.getElementById('volley-canvas'),ctx=canvas.getContext('2d');
    const status=document.getElementById('volley-status'),pauseButton=document.getElementById('volley-pause-btn');
    const elements=window.labElements;let phase='idle',paddle=136,ai=136,ball,p1=0,p2=0,frame,lastTime=0,activeMs=0,elementIndex=-1;
    const held=new Set();
    function resetBall(){ball={x:240,y:160,vx:(Math.random()>.5?1:-1)*210,vy:(Math.random()-.5)*180};}
    function announce(){const item=elements[Math.max(0,elementIndex)];document.getElementById('rally-element').textContent=localized(`本局元素：${item[0]} · ${item[2]}`,`Round element: ${item[0]} · ${item[1]}`);document.getElementById('volley-score-p1').textContent=p1;document.getElementById('volley-score-ai').textContent=p2;pauseButton.setAttribute('aria-pressed',String(phase==='paused'));status.textContent=phase==='over'?localized(p1===5?'你贏了！再來一場？':'AI 獲勝，再試一次吧。',p1===5?'You won! Another round?':'AI won. Give it another try.'):phase==='paused'?localized('已暫停。','Paused.'):localized('滑鼠、觸控或 W／S 控制球拍。','Use your mouse, touch or W / S to move.');}
    function draw(){const item=elements[Math.max(0,elementIndex)];ctx.fillStyle='#171d21';ctx.fillRect(0,0,480,320);ctx.strokeStyle='#5e6d72';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(240,0);ctx.lineTo(240,320);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#dce9e3';ctx.fillRect(12,paddle,8,48);ctx.fillStyle='#71878b';ctx.fillRect(460,ai,8,48);ctx.beginPath();ctx.arc(ball.x,ball.y,13,0,Math.PI*2);ctx.fillStyle=`hsl(${(elementIndex*37)%360} 35% 62%)`;ctx.fill();ctx.fillStyle='#172025';ctx.font='700 10px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(item[0],ball.x,ball.y);if(phase==='paused'||phase==='over'){ctx.fillStyle='rgba(23,29,33,.86)';ctx.fillRect(0,0,480,320);ctx.fillStyle='#f4f2eb';ctx.font='600 22px sans-serif';ctx.fillText(phase==='paused'?'PAUSED':p1===5?'YOU WIN':'AI WINS',240,165);}}
    function update(time){if(phase!=='running')return;const elapsed=Math.max(0,time-lastTime),dt=Math.min(elapsed/1000,.035);lastTime=time;activeMs+=elapsed;if(held.has('w')||held.has('arrowup'))paddle-=270*dt;if(held.has('s')||held.has('arrowdown'))paddle+=270*dt;paddle=Math.max(0,Math.min(272,paddle));ai+=Math.max(-165*dt,Math.min(165*dt,ball.y-24-ai));ai=Math.max(0,Math.min(272,ai));ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.y<6){ball.y=6;ball.vy=Math.abs(ball.vy);}if(ball.y>314){ball.y=314;ball.vy=-Math.abs(ball.vy);}if(ball.vx<0&&ball.x<=26&&ball.x>=12&&ball.y>=paddle-6&&ball.y<=paddle+54){ball.x=26;ball.vx=Math.min(430,Math.abs(ball.vx)*1.06);ball.vy=(ball.y-paddle-24)*8;}if(ball.vx>0&&ball.x>=454&&ball.x<=468&&ball.y>=ai-6&&ball.y<=ai+54){ball.x=454;ball.vx=-Math.min(430,Math.abs(ball.vx)*1.06);ball.vy=(ball.y-ai-24)*8;}if(ball.x<0||ball.x>480){if(ball.x<0)p2++;else p1++;resetBall();if(p1===5||p2===5){phase='over';if(p1===5)window.labRecord?.({game:'rally',score:5,duration_ms:Math.round(activeMs)});}announce();}draw();if(phase==='running')frame=requestAnimationFrame(update);}
    function resume(){activateGame('rally');phase='running';lastTime=performance.now();cancelAnimationFrame(frame);frame=requestAnimationFrame(update);announce();canvas.focus({preventScroll:true});}
    function pause(){if(phase==='running'){activeMs+=Math.max(0,performance.now()-lastTime);phase='paused';held.clear();cancelAnimationFrame(frame);announce();draw();}}
    gameControllers.rally={pause};
    document.getElementById('volley-start-btn').addEventListener('click',()=>{elementIndex=(Number(storage.get('msmtjl_rally_element','-1'))+1)%elements.length;storage.set('msmtjl_rally_element',String(elementIndex));activeMs=0;p1=p2=0;paddle=ai=136;resetBall();resume();});
    pauseButton.addEventListener('click',()=>{if(phase==='running')pause();else if(phase==='paused')resume();});
    const move=event=>{if(phase!=='running')return;const box=canvas.getBoundingClientRect();paddle=Math.max(0,Math.min(272,(event.clientY-box.top)*320/box.height-24));};
    canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);move(event);});canvas.addEventListener('pointermove',move);
    window.addEventListener('keydown',event=>{if(phase!=='running'||event.target.closest('input,textarea,[contenteditable]'))return;const key=event.key.toLowerCase();if(['w','s','arrowup','arrowdown'].includes(key)){held.add(key);event.preventDefault();}});
    window.addEventListener('keyup',event=>held.delete(event.key.toLowerCase()));
    document.addEventListener('languagechange',announce);
    resetBall();announce();draw();
}

// 離開視窗或切換分頁時暫停，避免回來時已經結束遊戲。
window.addEventListener('blur',()=>Object.values(gameControllers).forEach(game=>game.pause()));
document.addEventListener('visibilitychange',()=>{if(document.hidden)Object.values(gameControllers).forEach(game=>game.pause());});
// 捲出畫面也停止遊戲計時與繪製，不只依賴導覽連結或分頁失焦。
if(typeof IntersectionObserver!=='undefined'){
    Object.entries({snake:'snake-canvas',rally:'volley-canvas'}).forEach(([game,id])=>{
        const canvas=document.getElementById(id);if(canvas)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)gameControllers[game]?.pause();}).observe(canvas);
    });
}
