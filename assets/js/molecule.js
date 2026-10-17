'use strict';
// 共用渲染器切換獨立材料，離開畫面與低動態模式停止連續繪製。
function initThreeJsMolecule(){
 const host=document.getElementById('molecule-canvas');if(!host||typeof THREE==='undefined')return;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,150);
 const mobile=matchMedia('(max-width:800px)').matches;
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1:1.5));renderer.outputEncoding=THREE.sRGBEncoding;host.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xe6efff,0x393632,1.6));
 const key=new THREE.DirectionalLight(0xffeddb,1.8);key.position.set(3,9,15);scene.add(key);
 const rim=new THREE.DirectionalLight(0x95bade,1.3);rim.position.set(-8,-2,-5);scene.add(rim);
 const groups=createLabMaterials();groups.forEach(group=>scene.add(group));
 let progress=0,visible=false,elapsed=0,last=0,frame,fitDistance=36;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function draw(now){
 frame=0;if(!visible||document.hidden){last=0;return;}
 const moving=document.body.dataset.storyMotion==='full'||!reduced.matches&&document.body.dataset.storyMotion!=='reduced';
 if(moving)elapsed+=last?Math.min((now-last)/1000,.04):0;last=now;
 const p=Math.max(0,Math.min(2,progress)),index=Math.round(p);
 groups.forEach((group,i)=>{group.visible=i===index;if(i===index)group.rotation.set(i===2?-(Math.max(0,p-1.5)*2)*1.35:-.15,-.2+(p-index)*.9+Math.sin(elapsed*.18)*.1,i===1?.2:0);});
 renderer.domElement.style.opacity=String(1-Math.min(.96,Math.abs(p-index)*2));
 camera.position.set(Math.sin((p-index)*.8)*2,0,fitDistance+Math.abs(p-index)*3);camera.lookAt(0,0,0);renderer.render(scene,camera);if(moving)frame=requestAnimationFrame(draw);
 }
 function wake(){if(!frame)frame=requestAnimationFrame(draw);}
 new ResizeObserver(()=>{const box=host.getBoundingClientRect();if(!box.width||!box.height)return;camera.aspect=box.width/box.height;fitDistance=Math.max(29,21/(2*Math.tan(19*Math.PI/180)*camera.aspect));camera.updateProjectionMatrix();renderer.setSize(box.width,box.height,false);wake();}).observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)wake();}).observe(host);
 document.addEventListener('visibilitychange',wake);document.getElementById('story-motion-toggle').addEventListener('click',wake);reduced.addEventListener('change',wake);
 window.labHero={setProgress(value){progress=value;wake();}};
}
