'use strict';
document.addEventListener('DOMContentLoaded',()=>{
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(window.labArcadeUrl||''))return;
    const grid=document.querySelector('.games-grid');
    const frame=document.createElement('iframe');
    frame.title='MSMTJL games and shared records';frame.className='arcade-frame';frame.loading='lazy';
    frame.src=window.labArcadeUrl+'?lang='+encodeURIComponent(document.documentElement.lang);
    grid.replaceWith(frame);
});
