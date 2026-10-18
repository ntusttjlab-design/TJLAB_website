'use strict';
// PR4: same two-scene editorial hero model as the Laboratory overview.
// The subject matter and SVG art are research people and their collaboration,
// not invented member profiles or simulated research results.
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('members-page'))return;
 const section=document.getElementById('members');
 const stage=section?.querySelector('.members-story-stage');
 const panels=[...section.querySelectorAll('.story-copy')];
 const chapters=[...section.querySelectorAll('[data-scene]')];
 const labels=[...section.querySelectorAll('[data-model-label]')];
 const graphics=[...section.querySelectorAll('[data-graphic]')];
 const button=document.getElementById('members-motion-toggle');
 const header=document.querySelector('.site-header');
 const remaining=[...document.querySelectorAll('main > section[data-member-flow]')].filter(s=>s!==section);
 if(!stage||panels.length!==2||chapters.length!==2||labels.length!==2||graphics.length!==2||!button)return;
 const available=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined';
 const media=available?gsap.matchMedia():null;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let mode='system';
 try{mode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
 const clamp=(p)=>Math.max(0,Math.min(1,p));
 function measure(){
  document.documentElement.style.setProperty('--member-header-height',Math.ceil(header?.getBoundingClientRect().height||72)+'px');
  document.documentElement.style.setProperty('--member-viewport-height',innerHeight+'px');
 }
 function show(value){
  const p=Math.max(0,Math.min(1.99,value));
  const active=Math.min(1,Math.floor(p));
  stage.dataset.material=String(active);
  panels.forEach((panel,i)=>{
   panel.style.opacity=i===active?'1':'0';
   panel.style.visibility=i===active?'visible':'hidden';
   panel.inert=i!==active;
  });
  chapters.forEach((item,i)=>{
   item.classList.toggle('active',i===active);
   item.setAttribute('aria-pressed',String(i===active));
  });
  labels.forEach((label,i)=>{label.hidden=i!==active;});
  // Illustrations change smoothly over the same threshold that swaps the text.
  const fade=clamp((p-.86)/.28);
  graphics[0].style.opacity=String(1-fade);
  graphics[1].style.opacity=String(fade);
  graphics[0].style.transform='translate3d(0,'+(-12*clamp(p/.95))+'px,0) rotate('+(-7*clamp(p/.95))+'deg) scale('+(1+.09*clamp(p/.95))+')';
  graphics[1].style.transform='translate3d(0,'+((1-fade)*20)+'px,0) rotate('+((1-fade)*7)+'deg) scale('+(0.92+.08*fade)+')';
  const progress=stage.querySelector('.story-progress>span');
  if(progress)progress.style.transform='scaleX('+clamp((p-.15)/1.7)+')';
 }
 function label(){
  const en=document.documentElement.lang==='en';
  const reduced=document.body.dataset.memberFlow==='reduced';
  button.textContent=reduced?(en?'Play motion':'播放動態'):(en?'Reduce motion':'減少動態');
  button.setAttribute('aria-pressed',String(!reduced));
 }
 function configure(){
  measure();
  if(media)media.revert();
  if(!available){
   document.body.dataset.memberFlow='unavailable';
   show(.15);label();return;
  }
  gsap.registerPlugin(ScrollTrigger);
  media.add({
   desktop:'(min-width:801px)',mobile:'(max-width:800px)',
   reduce:'(prefers-reduced-motion: reduce)'
  },ctx=>{
   const reduced=mode==='reduced'||(mode!=='full'&&ctx.conditions.reduce);
   document.body.dataset.memberFlow=reduced?'reduced':'active';
   label();show(.15);
   if(reduced)return;
   const model={p:.15};
   gsap.to(model,{p:1.85,ease:'none',
    scrollTrigger:{
     id:'members-dual-story',trigger:section,
     start:()=> 'top top+='+(header?.offsetHeight||72),
     end:()=>'+='+innerHeight*(ctx.conditions.desktop?1.45:.9),
     pin:stage,scrub:.45,invalidateOnRefresh:true
    },
    onUpdate:()=>show(model.p)
   });
   // After the two-scene introduction, use the Laboratory's understated
   // heading/card entrances and keep game/gallery sections naturally scrollable.
   remaining.forEach(node=>{
    node.classList.add('chapter-section');
    const heading=node.querySelector('.member-section-heading,.section-heading,.member-note h2');
    const cards=[...node.querySelectorAll('.member-pi-card,.member-category,.activity-album,.activity-empty,.game-card')];
    if(heading)gsap.fromTo(heading,{y:30,opacity:.5},{y:0,opacity:1,duration:.7,ease:'power2.out',
      scrollTrigger:{id:'member-flow-'+node.dataset.memberFlow,trigger:node,start:'top 87%',toggleActions:'play none none reverse'}});
    else gsap.fromTo(node,{opacity:1},{opacity:1,scrollTrigger:{id:'member-flow-'+node.dataset.memberFlow,trigger:node,start:'top 87%'}});
    if(cards.length)gsap.fromTo(cards,{y:24},{y:0,ease:'none',
      scrollTrigger:{trigger:node,start:'top 90%',end:'top 20%',scrub:.4}});
    if(node.id==='lab-life'){
      const wash=node.querySelector('.lab-life-color-wash');
      if(wash)gsap.fromTo(wash,{opacity:0},{opacity:1,ease:'none',
       scrollTrigger:{id:'members-photo-color-transition',trigger:node,start:'top 96%',end:'top 32%',scrub:.45}});
    }
   });
  });
  ScrollTrigger.refresh();
 }
 button.addEventListener('click',()=>{
  mode=document.body.dataset.memberFlow==='reduced'?'full':'reduced';
  try{localStorage.setItem('msmtjl_motion',mode);}catch{}
  configure();
 });
 chapters.forEach((chapter,i)=>chapter.addEventListener('click',()=>{
  const trigger=available?ScrollTrigger.getById('members-dual-story'):null;
  if(trigger){
   window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*((i+.4-.15)/1.7),behavior:'smooth'});
  }else show(i+.4);
 }));
 let refreshTimer;
 function refresh(){
  clearTimeout(refreshTimer);
  refreshTimer=setTimeout(()=>{measure();if(available)ScrollTrigger.refresh();},120);
 }
 document.addEventListener('languagechange',()=>{label();refresh();});
 window.addEventListener('load',refresh,{once:true});
 document.fonts?.ready.then(refresh);
 preference.addEventListener?.('change',configure);
 window.addEventListener('resize',refresh,{passive:true});
 configure();
});
