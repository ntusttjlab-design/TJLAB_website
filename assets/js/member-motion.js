'use strict';
// PR4 experiment: the actual first Members hero becomes a scroll-controlled scene.
// It pins temporarily, scales the abstract team network, and reveals a second palette
// via a circular mask. There is NO inserted interstitial section or fabricated person.
document.addEventListener('DOMContentLoaded', () => {
 if(!document.body.classList.contains('members-page'))return;
 const hero=document.querySelector('.cinematic-members-hero');
 const pageSections=[...document.querySelectorAll('main > section[data-member-flow]')];
 const remaining=pageSections.filter(s=>s!==hero);
 const header=document.querySelector('.site-header');
 const next=hero?.querySelector('.cinematic-next');
 const nextContent=hero?.querySelector('.cinematic-next-inner');
 const copy=hero?.querySelector('.cinematic-hero-copy');
 const art=hero?.querySelector('.cinematic-hero-visual');
 const svg=hero?.querySelector('.cinematic-network');
 const cue=hero?.querySelector('.cinematic-scroll-cue');
 const toggle=document.getElementById('members-motion-toggle');
 const reducedPref=window.matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=window.matchMedia('(max-width:800px)');
 const enabled=typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined';
 if(!hero||!next||!nextContent||!copy||!art||!svg)return;
 let ctx=null,mode='system';
 try{mode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
 const disabled=()=>mode==='reduced'||(mode!=='full'&&reducedPref.matches);
 function updateHeaderHeight(){
  document.documentElement.style.setProperty('--member-header-height',Math.ceil(header?.getBoundingClientRect().height||80)+'px');
  document.documentElement.style.setProperty('--member-viewport-height',window.innerHeight+'px');
 }
 function updateToggle(){
  if(!toggle)return;
  const en=document.documentElement.lang==='en';
  toggle.textContent=disabled()?(en?'Play motion':'播放動態'):(en?'Reduce motion':'減少動態');
  toggle.setAttribute('aria-pressed',String(!disabled()));
 }
 function clear(){
  if(ctx){ctx.revert();ctx=null;}
  hero.removeAttribute('data-cinematic-active');
  remaining.forEach(section=>section.style.removeProperty('--member-glow-offset'));
 }
 function configure(){
  updateHeaderHeight();clear();updateToggle();
  document.body.dataset.memberFlow=disabled()?'reduced':enabled?'loading':'unavailable';
  if(disabled()||!enabled)return;
  gsap.registerPlugin(ScrollTrigger);
  ctx=gsap.context(()=>{
   const heroScene=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
    id:'members-cinematic-first',
    trigger:hero,
    start:()=> 'top top+='+(header?.getBoundingClientRect().height||80),
    end:()=>'+='+Math.max(420,Math.round((innerHeight-(header?.getBoundingClientRect().height||80))*(mobile.matches?.95:1.10))),
    pin:true,pinSpacing:true,scrub:.55,anticipatePin:1,
    invalidateOnRefresh:true
   }});
   heroScene.to(copy,{autoAlpha:0,y:-58,scale:.94,duration:.48},.08)
      .to(art,{scale:1.36,rotation:14,x:mobile.matches?-25:-45,y:mobile.matches?25:5,opacity:.23,duration:.8},0)
      .to(svg.querySelectorAll('.network-orbit'),{rotation:24,transformOrigin:'50% 50%',duration:.9},0)
      .to(next,{clipPath:'circle(155% at 72% 50%)',duration:.92},.1)
      .fromTo(nextContent,{autoAlpha:0,y:65,scale:.93},
         {autoAlpha:1,y:0,scale:1,duration:.64,immediateRender:false},.36);
   if(cue)heroScene.to(cue,{opacity:0,y:14,duration:.3},.02);
   // Later long-form sections retain their normal reading and game interaction.
   remaining.forEach(section=>{
    const heading=section.querySelector('.member-section-heading,.section-heading,.member-note h2');
    const items=[...section.querySelectorAll('.member-pi-card,.member-category,.activity-album,.activity-empty,.game-card')];
    const tl=gsap.timeline({scrollTrigger:{
     id:'member-flow-'+section.dataset.memberFlow,
     trigger:section,start:'top 88%',end:mobile.matches?'top 43%':'top 40%',
     scrub:mobile.matches?.25:.45,invalidateOnRefresh:true
    }});
    if(heading)tl.fromTo(heading,{autoAlpha:.78,y:22},
      {autoAlpha:1,y:0,duration:1,immediateRender:false},0);
    if(items.length)tl.fromTo(items,{autoAlpha:.78,y:18},
      {autoAlpha:1,y:0,stagger:.07,duration:.9,immediateRender:false},.15);
    tl.fromTo(section,{'--member-glow-offset':'-12px'},
      {'--member-glow-offset':'18px',duration:1,immediateRender:false},0);
   });
  });
  hero.dataset.cinematicActive='true';
  document.body.dataset.memberFlow='active';
  ScrollTrigger.refresh();
 }
 toggle?.addEventListener('click',()=>{
  mode=disabled()?'full':'reduced';
  try{localStorage.setItem('msmtjl_motion',mode);}catch{}
  configure();
 });
 configure();
 reducedPref.addEventListener?.('change',configure);
 mobile.addEventListener?.('change',configure);
 window.addEventListener('resize',updateHeaderHeight,{passive:true});
 document.addEventListener('languagechange',()=>{
  updateToggle();updateHeaderHeight();if(enabled)ScrollTrigger.refresh();
 });
 window.addEventListener('load',()=>{updateHeaderHeight();if(enabled)ScrollTrigger.refresh();},{once:true});
});
