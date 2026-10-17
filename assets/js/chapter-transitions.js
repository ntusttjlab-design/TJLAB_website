'use strict';
// Shared academic and lab-life chapter transitions; no 3D code on members page.
document.addEventListener('DOMContentLoaded',()=>{
 const bridges=[...document.querySelectorAll('[data-chapter-transition]')];
 if(!bridges.length)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const available=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined';
 let ctx=null;
 function clear(){
  if(ctx){ctx.revert();ctx=null;}
  bridges.forEach(bridge=>bridge.querySelectorAll('.bridge-curtain,.bridge-art,.bridge-index,.bridge-line,.member-motif').forEach(el=>el.removeAttribute('style')));
 }
 function configure(){
  clear();
  if(reduced.matches||document.body.dataset.storyMotion==='reduced'||!available)return;
  gsap.registerPlugin(ScrollTrigger);
  ctx=gsap.context(()=>{
   bridges.forEach(bridge=>{
    const curtain=bridge.querySelector('.bridge-curtain'),art=bridge.querySelector('.bridge-art'),index=bridge.querySelector('.bridge-index'),line=bridge.querySelector('.bridge-line');
    if(!curtain||!art||!index||!line)return;
    const mobile=window.matchMedia('(max-width:800px)').matches;
    const timeline=gsap.timeline({scrollTrigger:{trigger:bridge,start:'top bottom',end:'bottom 25%',scrub:mobile?.25:.65,invalidateOnRefresh:true}});
    timeline.fromTo(curtain,{scaleY:1},{scaleY:0,transformOrigin:'top',ease:'none',duration:1},0)
      .fromTo(art,{xPercent:mobile?-4:-12,y:22,opacity:.04},{xPercent:mobile?4:8,y:-8,opacity:.42,ease:'none',duration:1},0)
      .fromTo(index,{y:35,opacity:.03},{y:-10,opacity:.18,ease:'none',duration:1},0)
      .fromTo(line,{scaleX:0},{scaleX:1,transformOrigin:'left',ease:'none',duration:1},0);
    if(bridge.classList.contains('member-bridge')){
      const motifs=bridge.querySelectorAll('.member-motif');
      if(motifs.length)timeline.fromTo(motifs,{y:14,opacity:.08},{y:0,opacity:.85,stagger:.08,ease:'power1.out',duration:.6},.15);
    }
   });
  });
  ScrollTrigger.refresh();
 }
 configure();
 reduced.addEventListener?.('change',configure);
 document.addEventListener('languagechange',()=>window.ScrollTrigger?.refresh());
 document.getElementById('story-motion-toggle')?.addEventListener('click',()=>requestAnimationFrame(configure));
});
