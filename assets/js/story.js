'use strict';
// 動態偏好同時控制材料鏡頭、章節背景揭露與內容交接。
document.addEventListener('DOMContentLoaded',()=>{
 if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
 gsap.registerPlugin(ScrollTrigger);
 const section=document.getElementById('about'),stage=section.querySelector('.story-stage');
 const panels=[...section.querySelectorAll('.story-copy')],chapters=[...section.querySelectorAll('[data-scene]')];
 const labels=[...section.querySelectorAll('[data-model-label]')],media=gsap.matchMedia();
 if(panels.length!==2||chapters.length!==2||labels.length!==2)return;
 const button=document.getElementById('story-motion-toggle');
 let mode='system';
 try{mode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
 function show(progress){
   const current=Math.min(1,Math.floor(progress));stage.dataset.material=String(current);
   panels.forEach((panel,i)=>{panel.style.opacity=i===current?'1':'0';panel.style.visibility=i===current?'visible':'hidden';panel.inert=i!==current;});
   chapters.forEach((item,i)=>{item.classList.toggle('active',i===current);item.setAttribute('aria-pressed',String(i===current));});
   labels.forEach((label,i)=>label.hidden=i!==current);window.labHero?.setProgress(progress);
 }
 function label(){const en=document.documentElement.lang==='en',reduced=document.body.dataset.storyMotion==='reduced';button.textContent=reduced?(en?'Play motion':'播放動態'):(en?'Reduce motion':'減少動態');}
 function configure(){
   media.revert();
   media.add({desktop:'(min-width:801px)',mobile:'(max-width:800px)',reduce:'(prefers-reduced-motion: reduce)'},ctx=>{
     const reduced=mode==='reduced'||mode!=='full'&&ctx.conditions.reduce;
     document.body.dataset.storyMotion=reduced?'reduced':'full';
     button.setAttribute('aria-pressed',String(!reduced));label();show(.15);
     if(reduced)return;
     const model={p:.15};
     gsap.to(model,{p:1.85,ease:'none',scrollTrigger:{id:'molecular-story',trigger:section,start:()=> 'top top+='+document.querySelector('.site-header').offsetHeight,end:()=>'+='+innerHeight*(ctx.conditions.desktop?1.45:.9),pin:'.story-stage',scrub:.45,invalidateOnRefresh:true},onUpdate:()=>show(model.p)});
     // 短轉場由前章底色揭露後章底色，材料圖形穿過兩個章節的交界。
     document.querySelectorAll('[data-chapter-transition]').forEach((bridge,index)=>{
       const timeline=gsap.timeline({scrollTrigger:{id:'chapter-'+bridge.dataset.chapterTransition,trigger:bridge,start:'top bottom',end:'bottom 25%',scrub:ctx.conditions.desktop?.65:.25}});
       timeline.fromTo(bridge.querySelector('.bridge-curtain'),{scaleY:1},{scaleY:0,transformOrigin:'top',ease:'none',duration:1},0)
         .fromTo(bridge.querySelector('.bridge-art'),{xPercent:ctx.conditions.desktop?-12:-4,y:22,opacity:.04},{xPercent:ctx.conditions.desktop?8:4,y:-8,opacity:.42,ease:'none',duration:1},0)
         .fromTo(bridge.querySelector('.bridge-index'),{y:35,opacity:.03},{y:-10,opacity:.18,ease:'none',duration:1},0)
         .fromTo(bridge.querySelector('.bridge-line'),{scaleX:0},{scaleX:1,transformOrigin:'left',ease:'none',duration:1},0);
     });
     document.querySelectorAll('#pi,#research,#publications,#tutorials,#tutorial-resources,#dielectric,#arcade,#join').forEach(node=>{
       node.classList.add('chapter-section');
       const title=node.querySelectorAll('.section-heading,.dielectric-copy,.pi-photo,.join-grid>div:first-child');
       const body=node.querySelector('.research-grid,.bio-columns,#publication-list,.course-grid,.games-grid,.dielectric-panel,.join-notes');
       if(title.length)gsap.fromTo(title,{y:30,opacity:.5},{y:0,opacity:1,duration:.7,ease:'power2.out',scrollTrigger:{trigger:node,start:'top 87%',toggleActions:'play none none reverse'}});
       if(body)gsap.fromTo(body,{y:24},{y:0,ease:'none',scrollTrigger:{trigger:node,start:'top 90%',end:'top 20%',scrub:.4}});
     });
   });
   ScrollTrigger.refresh();
 }
 button.addEventListener('click',()=>{mode=document.body.dataset.storyMotion==='full'?'reduced':'full';try{localStorage.setItem('msmtjl_motion',mode);}catch{}configure();});
 chapters.forEach((chapter,i)=>chapter.addEventListener('click',()=>{const trigger=ScrollTrigger.getById('molecular-story');if(trigger)window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*((i+.4-.15)/1.7),behavior:'smooth'});else show(i+.4);}));
 let refreshTimer;function refresh(){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>ScrollTrigger.refresh(),120);}
 document.addEventListener('languagechange',()=>{label();refresh();});document.addEventListener('publicationschange',refresh);
 window.addEventListener('load',refresh,{once:true});document.fonts?.ready.then(refresh);configure();
});
