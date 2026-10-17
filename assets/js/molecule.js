'use strict';
// 捲動只改變鏡頭與整體取向，保留分子鍵結與幾何。
function initThreeJsMolecule() {
 const host=document.getElementById('molecule-canvas');
 if(!host||typeof THREE==='undefined')return;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputEncoding=THREE.sRGBEncoding;host.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x536d5c,1.4));const key=new THREE.DirectionalLight(0xffffff,1.2);key.position.set(3,9,15);scene.add(key);
 const molecule=createLabMolecule();scene.add(molecule);
 let progress=0,visible=false,elapsed=0,last=0,frame,fitDistance=36;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function draw(now){frame=0;if(!visible||document.hidden){last=0;return;}const moving=document.body.dataset.storyMotion==='full'||!reduced.matches&&document.body.dataset.storyMotion!=='reduced';if(moving)elapsed+=last?Math.min((now-last)/1000,.04):0;last=now;const p=Math.max(0,Math.min(2,progress));molecule.rotation.set(-.12+p*.15,-.15+p*.4+Math.sin(elapsed*.2)*.08,-.08);camera.position.set(p*.35,p*.25,fitDistance-p*1.1);renderer.render(scene,camera);if(moving)frame=requestAnimationFrame(draw);}
 function wake(){if(!frame)frame=requestAnimationFrame(draw);}
 new ResizeObserver(()=>{const box=host.getBoundingClientRect();if(!box.width||!box.height)return;camera.aspect=box.width/box.height;fitDistance=Math.max(27,20/(2*Math.tan(19*Math.PI/180)*camera.aspect));camera.updateProjectionMatrix();renderer.setSize(box.width,box.height,false);wake();}).observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)wake();}).observe(host);
 document.addEventListener('visibilitychange',wake);document.getElementById('story-motion-toggle').addEventListener('click',wake);reduced.addEventListener('change',wake);
 window.labHero={setProgress(value){progress=value;wake();}};
}
