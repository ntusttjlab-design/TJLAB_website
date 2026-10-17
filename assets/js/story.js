// 將閱讀進度連到視覺敘事，保留原生捲動與手機／低動態替代呈現。
document.addEventListener('DOMContentLoaded',()=>{
    if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
    gsap.registerPlugin(ScrollTrigger);
    const section=document.getElementById('about');
    const panels=[...section.querySelectorAll('.story-copy')];
    const chapters=[...section.querySelectorAll('.story-chapters>span')];
    const media=gsap.matchMedia();
    const motionButton=document.getElementById('story-motion-toggle');
    let motionMode='system';
    try{motionMode=localStorage.getItem('msmtjl_motion')||'system';}catch{}
    function buttonLabel(){
        const reduced=motionMode==='reduced'||motionMode!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
        const english=document.documentElement.lang==='en';
        motionButton.textContent=reduced?(english?'Play motion':'播放動態'):(english?'Reduce motion':'減少動態');
        motionButton.setAttribute('aria-pressed',String(!reduced));
        document.body.dataset.storyMotion=reduced?'reduced':'full';
    }
    function configure(){
    media.revert();
    buttonLabel();
    media.add({desktop:'(min-width: 801px)',mobile:'(max-width: 800px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
        const {desktop}=context.conditions;
        const reduce=motionMode==='reduced'||motionMode!=='full'&&context.conditions.reduce;
        if(reduce){window.labHero?.setProgress(0);return;}
        const model={progress:0};
        const timeline=gsap.timeline({
            defaults:{ease:'none'},
            scrollTrigger:{id:'molecular-story',trigger:section,start:()=>`top top+=${document.querySelector('.site-header').offsetHeight}`,end:()=>'+='+innerHeight*(desktop?2.4:1.8),pin:'.story-stage',scrub:.65,invalidateOnRefresh:true,
                onUpdate(self){const stage=self.progress<.29?0:self.progress<.68?1:2;chapters.forEach((item,index)=>item.classList.toggle('active',index===stage));}}
        });
        timeline.to(model,{progress:2,duration:3,onUpdate:()=>window.labHero?.setProgress(model.progress)},0)
            .to('.story-progress>span',{scaleX:1,duration:3,transformOrigin:'left center'},0)
            .to(panels[0],{autoAlpha:0,y:-45,duration:.32},.45)
            .fromTo(panels[1],{autoAlpha:0,y:45},{autoAlpha:1,y:0,duration:.38,immediateRender:false},.85)
            .to(panels[1],{autoAlpha:0,y:-45,duration:.32},1.7)
            .fromTo(panels[2],{autoAlpha:0,y:45},{autoAlpha:1,y:0,duration:.38,immediateRender:false},2.1);
        if(desktop){
            gsap.from('.story-copy[data-step="0"] h1',{y:28,autoAlpha:0,duration:1,ease:'power2.out',clearProps:'transform,opacity,visibility'});
        }
        return ()=>{window.labHero?.setProgress(0);chapters.forEach((item,index)=>item.classList.toggle('active',index===0));};
    });
    }
    motionButton.addEventListener('click',()=>{
        motionMode=document.body.dataset.storyMotion==='full'?'reduced':'full';
        try{localStorage.setItem('msmtjl_motion',motionMode);}catch{}
        configure();ScrollTrigger.refresh();
    });
    configure();
    // 篩選、雙語與圖片載入會改變段落高度，集中重新計算。
    let refreshTimer;
    function refresh(){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>ScrollTrigger.refresh(),100);}
    document.addEventListener('languagechange',()=>{buttonLabel();refresh();});
    document.getElementById('pub-search-input').addEventListener('input',refresh);
    document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',refresh));
    window.addEventListener('load',refresh,{once:true});
    document.fonts?.ready.then(refresh);
});
