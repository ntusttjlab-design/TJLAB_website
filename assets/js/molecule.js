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
 let progress=.15,visible=false,elapsed=0,last=0,frame,fitDistance=36;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function draw(now){
 frame=0;if(!visible||document.hidden){last=0;return;}
 const moving=document.body.dataset.storyMotion==='full'||!reduced.matches&&document.body.dataset.storyMotion!=='reduced';
 if(moving)elapsed+=last?Math.min((now-last)/1000,.04):0;last=now;
 const p=Math.max(0,Math.min(2.99,progress)),index=Math.floor(p),shot=p-index;
 groups.forEach((group,i)=>{group.visible=i===index;if(i===index)group.rotation.set(i===2?-.1-shot*1.25:-.1+shot*.16,-.3+shot*.65+Math.sin(elapsed*.18)*.05,i===1?.12:0);});
 const edge=Math.min(1,shot/.12,(1-shot)/.12);
 renderer.domElement.style.opacity=String(Math.max(.04,edge));
 // 玻璃場景加入局部近看；各材料仍維持固定鍵結，不相互變形。
 const detail=index===1?Math.sin(shot*Math.PI)*.24:Math.sin(shot*Math.PI)*.07;
 camera.position.set((shot-.5)*2,index===1?Math.sin(shot*Math.PI)*.6:0,fitDistance*(1-detail));camera.lookAt(0,0,0);renderer.render(scene,camera);if(moving)frame=requestAnimationFrame(draw);
 }
 function wake(){if(!frame)frame=requestAnimationFrame(draw);}
 new ResizeObserver(()=>{const box=host.getBoundingClientRect();if(!box.width||!box.height)return;camera.aspect=box.width/box.height;fitDistance=Math.max(29,21/(2*Math.tan(19*Math.PI/180)*camera.aspect));camera.updateProjectionMatrix();renderer.setSize(box.width,box.height,false);wake();}).observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)wake();}).observe(host);
 document.addEventListener('visibilitychange',wake);document.getElementById('story-motion-toggle').addEventListener('click',wake);reduced.addEventListener('change',wake);
 window.labHero={setProgress(value){progress=value;wake();}};
}
