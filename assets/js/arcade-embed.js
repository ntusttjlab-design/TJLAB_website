'use strict';
document.addEventListener('DOMContentLoaded',()=>{
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(window.labArcadeUrl||''))return;
    const grid=document.querySelector('.games-grid');
    if(!grid)return;
    const frame=document.createElement('iframe');
    let gameWindow,gameOrigin;
    function language(){gameWindow?.postMessage({type:'msmtjl-language',lang:document.documentElement.lang},gameOrigin);}
    frame.title='MSMTJL games and shared records';frame.className='arcade-frame';frame.loading='eager';frame.hidden=true;
    grid.after(frame);
    // GAS 成功回報後才切換；若網路失敗，本機遊戲仍可完整操作。
    function ready(event){
        if(!/^https:\/\/[a-z0-9-]+-script\.googleusercontent\.com$/.test(event.origin))return;
        if(event.data?.type==='msmtjl-arcade-size'&&Number.isFinite(event.data.height)){
            frame.style.height=Math.max(500,Math.min(4000,event.data.height+24))+'px';
            window.ScrollTrigger?.refresh();return;
        }
        if(event.data!=='msmtjl-arcade-ready-v2')return;
        gameWindow=event.source;gameOrigin=event.origin;language();
        Object.values(gameControllers).forEach(game=>game.pause());grid.hidden=true;frame.hidden=false;
    }
    window.addEventListener('message',ready);
    document.addEventListener('languagechange',language);
    // 進入遊戲區附近才請求 GAS，隱藏 iframe 不依賴瀏覽器延遲載入。
    const observer=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;frame.src=window.labArcadeUrl+'?lang='+encodeURIComponent(document.documentElement.lang);observer.disconnect();},{rootMargin:'400px'});
    observer.observe(grid);
});
