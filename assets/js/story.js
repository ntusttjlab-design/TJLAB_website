'use strict';
// 首頁材料與章節進場共用動態偏好，保留原生捲動。
document.addEventListener('DOMContentLoaded',()=>{
 if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
 gsap.registerPlugin(ScrollTrigger);
 const section=document.getElementById('about'),stage=section.querySelector('.story-stage');
 const panels=[...section.querySelectorAll('.story-copy')],chapters=[...section.querySelectorAll('[data-scene]')];
 const labels=[...section.querySelectorAll('[data-model-label]')],media=gsap.matchMedia();
 const button=document.getElementById('story-motion-toggle');
 let mode='system',current=0;
 try{mode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
 function show(progress){
   current=Math.round(progress);stage.dataset.material=String(current);
   panels.forEach((panel,i)=>{panel.style.opacity=i===current?'1':'0';panel.style.visibility=i===current?'visible':'hidden';panel.inert=i!==current;});
   chapters.forEach((item,i)=>{item.classList.toggle('active',i===current);item.setAttribute('aria-pressed',String(i===current));});
   labels.forEach((label,i)=>label.hidden=i!==current);window.labHero?.setProgress(progress);
 }
 function configure(){
   media.revert();
   media.add({desktop:'(min-width:801px)',mobile:'(max-width:800px)',reduce:'(prefers-reduced-motion: reduce)'},ctx=>{
     const reduced=mode==='reduced'||mode!=='full'&&(ctx.conditions.reduce||!ctx.conditions.desktop);
     document.body.dataset.storyMotion=reduced?'reduced':'full';
     button.setAttribute('aria-pressed',String(!reduced));label();show(0);
     if(reduced)return;
     const model={p:0};
     gsap.to(model,{p:2,ease:'none',scrollTrigger:{id:'molecular-story',trigger:section,start:()=> 'top top+='+document.querySelector('.site-header').offsetHeight,end:()=>'+='+innerHeight*(ctx.conditions.desktop?2.5:1.8),pin:'.story-stage',scrub:.5,invalidateOnRefresh:true},onUpdate:()=>show(model.p)});
     // 只動畫章節標題與主視覺，不替每篇長書目建立時間軸。
     document.querySelectorAll('#dielectric,#research,#pi,#publications,#tutorials,#arcade,#join').forEach(node=>{
       const targets=node.querySelectorAll('.section-heading,.dielectric-copy,.pi-photo,.join-grid>div:first-child');
       if(targets.length)gsap.fromTo(targets,{y:36,opacity:.25},{y:0,opacity:1,duration:.75,ease:'power2.out',scrollTrigger:{trigger:node,start:'top 88%',toggleActions:'play none none reverse'}});
       node.classList.add('chapter-section');
     });
   });
   ScrollTrigger.refresh();
 }
 function label(){const en=document.documentElement.lang==='en',reduced=document.body.dataset.storyMotion==='reduced';button.textContent=reduced?(en?'Play motion':'播放動態'):(en?'Reduce motion':'減少動態');}
 button.addEventListener('click',()=>{mode=document.body.dataset.storyMotion==='full'?'reduced':'full';try{localStorage.setItem('msmtjl_motion',mode);}catch{}configure();});
 chapters.forEach((chapter,i)=>chapter.addEventListener('click',()=>{const trigger=ScrollTrigger.getById('molecular-story');if(trigger)window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*i/2,behavior:'smooth'});else show(i);}));
 let refreshTimer;function refresh(){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>ScrollTrigger.refresh(),120);}
 document.addEventListener('languagechange',()=>{label();refresh();});
 document.addEventListener('publicationschange',refresh);
 window.addEventListener('load',refresh,{once:true});document.fonts?.ready.then(refresh);configure();
});
