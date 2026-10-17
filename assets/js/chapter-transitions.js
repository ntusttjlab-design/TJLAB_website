'use strict';
// Full-height laboratory-member chapter handoffs; original academic bridges keep their choreography.
document.addEventListener('DOMContentLoaded', () => {
 const bridges=[...document.querySelectorAll('[data-chapter-transition]')];
 if(!bridges.length)return;
 const members=document.body.classList.contains('members-page');
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const small=window.matchMedia('(max-width:800px)');
 const enabled=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined';
 const button=document.getElementById('members-motion-toggle');
 let ctx=null;
 let mode='system';
 try{mode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
 function reduced(){
  return members?(mode==='reduced'||mode!=='full'&&preference.matches):
    (document.body.dataset.storyMotion?document.body.dataset.storyMotion==='reduced':preference.matches);
 }
 function label(){
  if(!button)return;
  const stop=reduced(),en=document.documentElement.lang==='en';
  button.textContent=stop?(en?'Play motion':'播放動態'):(en?'Reduce motion':'減少動態');
  button.setAttribute('aria-pressed',String(!stop));
 }
 function clear(){
  if(ctx){ctx.revert();ctx=null;}
  bridges.forEach(b=>{
   b.removeAttribute('data-transition-active');
   b.querySelectorAll('.bridge-curtain,.bridge-art,.bridge-index,.bridge-line,.member-motif,.member-transition-copy').forEach(el=>el.removeAttribute('style'));
  });
 }
 function start(){
  clear();
  label();
  if(members)document.body.dataset.memberTransitions=reduced()?'reduced':enabled?'loading':'unavailable';
  if(reduced()||!enabled)return;
  gsap.registerPlugin(ScrollTrigger);
  ctx=gsap.context(()=>{
   bridges.forEach(bridge=>{
    const curtain=bridge.querySelector('.bridge-curtain'),art=bridge.querySelector('.bridge-art'),
      index=bridge.querySelector('.bridge-index'),line=bridge.querySelector('.bridge-line');
    if(!curtain||!art||!index||!line)return;
    const mobile=small.matches,member=bridge.classList.contains('member-bridge');
    const timeline=gsap.timeline({scrollTrigger:{
      id:member?'member-transition-'+bridge.dataset.chapterTransition:undefined,
      trigger:bridge,start:member?'top 90%':'top bottom',
      end:member?'bottom 12%':'bottom 25%',
      scrub:member?(mobile?.45:.7):(mobile?.25:.65),
      invalidateOnRefresh:true
    }});
    if(member){
      timeline.fromTo(curtain,{scaleY:1},{scaleY:0,transformOrigin:'top',ease:'none',duration:1},0)
       .fromTo(art,{xPercent:mobile?-12:-21,y:mobile?30:85,opacity:.16,scale:.86},
         {xPercent:0,y:0,opacity:.94,scale:1,ease:'none',duration:.92},.06)
       .fromTo(index,{y:80,opacity:0},{y:0,opacity:.18,ease:'none',duration:.85},.1)
       .fromTo(line,{scaleX:0},{scaleX:1,transformOrigin:'left',ease:'none',duration:.9},.1);
      const copy=bridge.querySelector('.member-transition-copy');
      if(copy)timeline.fromTo(copy,{x:mobile?-12:-55,y:mobile?24:55,opacity:0},
        {x:0,y:0,opacity:1,ease:'none',duration:.7},.18);
      const motifs=bridge.querySelectorAll('.member-motif');
      if(motifs.length)timeline.fromTo(motifs,{y:45,x:i=>i%2?-44:44,opacity:.14},
        {y:0,x:0,opacity:1,stagger:.08,ease:'none',duration:.6},.2);
      bridge.dataset.transitionActive='true';
    }else{
      timeline.fromTo(curtain,{scaleY:1},{scaleY:0,transformOrigin:'top',ease:'none',duration:1},0)
       .fromTo(art,{xPercent:mobile?-4:-12,y:22,opacity:.04},
         {xPercent:mobile?4:8,y:-8,opacity:.42,ease:'none',duration:1},0)
       .fromTo(index,{y:35,opacity:.03},{y:-10,opacity:.18,ease:'none',duration:1},0)
       .fromTo(line,{scaleX:0},{scaleX:1,transformOrigin:'left',ease:'none',duration:1},0);
    }
   });
  });
  if(members)document.body.dataset.memberTransitions='active';
  ScrollTrigger.refresh();
 }
 button?.addEventListener('click',()=>{
  mode=reduced()?'full':'reduced';
  try{localStorage.setItem('msmtjl_motion',mode);}catch{}
  start();
 });
 start();
 preference.addEventListener?.('change',start);
 small.addEventListener?.('change',start);
 document.addEventListener('languagechange',()=>{
  label();window.ScrollTrigger?.refresh();
 });
 document.getElementById('story-motion-toggle')?.addEventListener('click',()=>requestAnimationFrame(start));
 window.addEventListener('load',()=>window.ScrollTrigger?.refresh(),{once:true});
});
