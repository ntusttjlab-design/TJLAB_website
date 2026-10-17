'use strict';
// Direct section-to-section flow without interstitial pages or scroll pinning.
// CSS does all cross-section color blends, GSAP only adds subtle on-content reveals.
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('members-page'))return;
 const sections=[...document.querySelectorAll('main > section[data-member-flow]')];
 const contentSections=sections.filter(section=>section.dataset.memberFlow!=='intro');
 const button=document.getElementById('members-motion-toggle');
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=window.matchMedia('(max-width:800px)');
 const available=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined';
 let ctx=null,mode='system';
 try{mode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
 function reduced(){return mode==='reduced'||(mode!=='full'&&preference.matches);}
 function label(){
  if(!button)return;
  const en=document.documentElement.lang==='en';
  button.textContent=reduced()?(en?'Play motion':'播放動態'):(en?'Reduce motion':'減少動態');
  button.setAttribute('aria-pressed',String(!reduced()));
 }
 function reset(){
  if(ctx){ctx.revert();ctx=null;}
  contentSections.forEach(section=>section.style.removeProperty('--member-glow-offset'));
 }
 function start(){
  reset();label();
  document.body.dataset.memberFlow=reduced()?'reduced':available?'loading':'unavailable';
  if(reduced()||!available)return;
  gsap.registerPlugin(ScrollTrigger);
  ctx=gsap.context(()=>{
   contentSections.forEach(section=>{
    const heading=section.querySelector('.member-section-heading,.section-heading,.member-note h2');
    const cards=[...section.querySelectorAll('.member-pi-card,.member-category,.activity-album,.activity-empty,.game-card')];
    const tl=gsap.timeline({scrollTrigger:{
      id:'member-flow-'+section.dataset.memberFlow,
      trigger:section,
      start:'top 88%',end:mobile.matches?'top 44%':'top 40%',
      scrub:mobile.matches?.25:.45,
      invalidateOnRefresh:true
    }});
    if(heading)tl.fromTo(heading,{autoAlpha:.72,y:20},
      {autoAlpha:1,y:0,duration:1,ease:'none',immediateRender:false},0);
    if(cards.length)tl.fromTo(cards,{autoAlpha:.75,y:18},
      {autoAlpha:1,y:0,stagger:.09,duration:.9,ease:'none',immediateRender:false},.1);
    tl.fromTo(section,{'--member-glow-offset':'-14px'},
      {'--member-glow-offset':'18px',duration:1,ease:'none',immediateRender:false},0);
   });
  });
  document.body.dataset.memberFlow='active';
  ScrollTrigger.refresh();
 }
 button?.addEventListener('click',()=>{
  mode=reduced()?'full':'reduced';
  try{localStorage.setItem('msmtjl_motion',mode);}catch{}
  start();
 });
 start();
 preference.addEventListener?.('change',start);
 mobile.addEventListener?.('change',start);
 document.addEventListener('languagechange',()=>{
  label();
  if(available)ScrollTrigger.refresh();
 });
 window.addEventListener('load',()=>{if(available)ScrollTrigger.refresh();},{once:true});
});
