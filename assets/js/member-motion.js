'use strict';
// Small, accessible member-page reveals; shares the site's GSAP timing and typography.
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('members-page'))return;
 const blocks=[...document.querySelectorAll('.member-reveal-section')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
 gsap.registerPlugin(ScrollTrigger);
 let ctx;
 function start(){
  if(ctx){ctx.revert();ctx=null;}
  if(reduced.matches)return;
  ctx=gsap.context(()=>{
   blocks.forEach(section=>{
    const heading=section.querySelector('.member-section-heading,.member-note h2');
    if(heading)gsap.fromTo(heading,{y:20,opacity:.75},{y:0,opacity:1,duration:.6,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 84%',toggleActions:'play none none reverse'}});
    const cards=[...section.querySelectorAll('.member-category,.activity-album')];
    if(cards.length)gsap.fromTo(cards,{y:18,opacity:.65},{y:0,opacity:1,stagger:.08,duration:.55,ease:'power1.out',scrollTrigger:{trigger:section,start:'top 76%',toggleActions:'play none none reverse'}});
   });
  });
  ScrollTrigger.refresh();
 }
 start();reduced.addEventListener?.('change',start);
});
