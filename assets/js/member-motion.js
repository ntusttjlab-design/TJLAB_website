'use strict';
// One topic, one real section. Transform the full viewport hero into the real team list.
// No extra page, pinned viewport, or duplicate team introduction.
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('members-page'))return;
 const hero=document.querySelector('.cinematic-members-hero');
 const team=document.getElementById('members-list');
 const all=[...document.querySelectorAll('main > section[data-member-flow]')];
 const after=all.filter(s=>s!==hero&&s!==team);
 const header=document.querySelector('.site-header');
 const copy=hero?.querySelector('.cinematic-hero-copy');
 const visual=hero?.querySelector('.cinematic-hero-visual');
 const svg=hero?.querySelector('.cinematic-network');
 const cue=hero?.querySelector('.cinematic-scroll-cue');
 const toggle=document.getElementById('members-motion-toggle');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width:800px)');
 const ready=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined';
 if(!hero||!team||!copy||!visual||!svg)return;
 let ctx=null,mode='system';
 try{mode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
 const reduced=()=>mode==='reduced'||(mode!=='full'&&preference.matches);
 function dimensions(){
  document.documentElement.style.setProperty('--member-header-height',Math.ceil(header?.getBoundingClientRect().height||80)+'px');
  document.documentElement.style.setProperty('--member-viewport-height',innerHeight+'px');
 }
 function label(){
  if(!toggle)return;
  const en=document.documentElement.lang==='en';
  toggle.textContent=reduced()?(en?'Play motion':'播放動態'):(en?'Reduce motion':'減少動態');
  toggle.setAttribute('aria-pressed',String(!reduced()));
 }
 function reset(){
  if(ctx){ctx.revert();ctx=null;}
  hero.removeAttribute('data-cinematic-active');
  team.style.removeProperty('clip-path');
  after.forEach(s=>{s.style.removeProperty('--member-glow-offset');s.style.removeProperty('--life-transition-progress');});
 }
 function start(){
  dimensions();reset();label();
  document.body.dataset.memberFlow=reduced()?'reduced':ready?'loading':'unavailable';
  if(reduced()||!ready)return;
  gsap.registerPlugin(ScrollTrigger);
  ctx=gsap.context(()=>{
   const outgoing=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
    id:'members-cinematic-first',trigger:hero,
    start:()=> 'top top+='+(header?.getBoundingClientRect().height||80),
    end:()=> 'bottom top+='+(header?.getBoundingClientRect().height||80),
    scrub:mobile.matches?.45:.65,pin:false,invalidateOnRefresh:true
   }});
   outgoing.to(copy,{autoAlpha:.1,y:-70,scale:.9,duration:1},0)
     .to(visual,{scale:1.55,rotation:20,x:mobile.matches?-15:-95,y:-30,opacity:.08,duration:1},0)
     .to(svg.querySelectorAll('.network-orbit'),{rotation:32,transformOrigin:'50% 50%',duration:1},0);
   if(cue)outgoing.to(cue,{autoAlpha:0,y:16,duration:.5},0);
   const heading=team.querySelector('.member-section-heading');
   const cards=[...team.querySelectorAll('.member-pi-card,.member-category')];
   const incoming=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
    id:'members-real-content-reveal',trigger:team,
    start:'top bottom',end:mobile.matches?'top 12%':'top 22%',
    scrub:mobile.matches?.36:.55,pin:false,invalidateOnRefresh:true
   }});
   incoming.fromTo(team,{clipPath:'inset(0 0 96% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1,immediateRender:false},0);
   if(heading)incoming.fromTo(heading,{autoAlpha:.35,y:58},{autoAlpha:1,y:0,duration:.8,immediateRender:false},.16);
   if(cards.length)incoming.fromTo(cards,{autoAlpha:.45,y:50},{autoAlpha:1,y:0,stagger:.04,duration:.7,immediateRender:false},.24);
   after.forEach(section=>{
    const title=section.querySelector('.member-section-heading,.section-heading,.member-note h2');
    const items=[...section.querySelectorAll('.activity-album,.activity-empty,.game-card')];
    const tl=gsap.timeline({scrollTrigger:{id:'member-flow-'+section.dataset.memberFlow,
      trigger:section,start:'top 88%',end:mobile.matches?'top 43%':'top 40%',
      scrub:mobile.matches?.25:.45,invalidateOnRefresh:true}});
    if(section.id==='lab-life'){
      // Begin with the sage surface before the photo section enters the viewport.
      // Context-scoped set is reverted when motion is disabled.
      gsap.set(section,{'--life-transition-progress':0});
      tl.to(section,{'--life-transition-progress':1,duration:1,ease:'none'},0);
    }
    if(title)tl.fromTo(title,{autoAlpha:.78,y:22},{autoAlpha:1,y:0,duration:1,immediateRender:false},0);
    if(items.length)tl.fromTo(items,{autoAlpha:.78,y:18},{autoAlpha:1,y:0,stagger:.07,duration:.9,immediateRender:false},.15);
    tl.fromTo(section,{'--member-glow-offset':'-12px'},{'--member-glow-offset':'18px',duration:1,immediateRender:false},0);
   });
  });
  hero.dataset.cinematicActive='true';
  document.body.dataset.memberFlow='active';
  ScrollTrigger.refresh();
 }
 toggle?.addEventListener('click',()=>{mode=reduced()?'full':'reduced';try{localStorage.setItem('msmtjl_motion',mode);}catch{}start();});
 start();
 preference.addEventListener?.('change',start);
 mobile.addEventListener?.('change',start);
 addEventListener('resize',dimensions,{passive:true});
 document.addEventListener('languagechange',()=>{label();dimensions();if(ready)ScrollTrigger.refresh();});
 addEventListener('load',()=>{dimensions();if(ready)ScrollTrigger.refresh();},{once:true});
});
