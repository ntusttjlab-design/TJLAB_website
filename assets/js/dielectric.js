'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const host=document.getElementById('dielectric-canvas');if(!host||typeof THREE==='undefined')return;
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputEncoding=THREE.sRGBEncoding;host.appendChild(renderer.domElement);document.getElementById('dielectric-fallback').hidden=true;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);
 scene.add(new THREE.HemisphereLight(0xffffff,0x647f6e,1.4));const light=new THREE.DirectionalLight(0xffffff,1.2);light.position.set(3,8,12);scene.add(light);
 const view=new THREE.Group(),molecule=createLabMolecule();view.add(molecule);scene.add(view);
 const field=new THREE.Group(),right=new THREE.Vector3(1,0,0),left=new THREE.Vector3(-1,0,0);
 const arrows=[-4,0,4].map(y=>{const arrow=new THREE.ArrowHelper(right,new THREE.Vector3(-10,y,-3),20,0x3c9d7c,.7,.3);field.add(arrow);return arrow;});scene.add(field);
 const button=document.getElementById('dielectric-field'),pause=document.getElementById('dielectric-pause'),speed=document.getElementById('dielectric-speed'),reset=document.getElementById('dielectric-reset'),status=document.getElementById('dielectric-status');[button,pause,speed,reset].forEach(control=>{control.disabled=false;});
 let enabled=false,paused=false,explicit=false,visible=false,time=0,last=0,frame=0,dragging=false,lastX=0,lastY=0,zoom=1;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function labels(){const en=document.documentElement.lang==='en';status.textContent=(enabled?(en?'Field on':'電場開啟'):(en?'Field off':'電場關閉'))+(paused?(en?' · Paused':' · 已暫停'):'');button.setAttribute('aria-pressed',String(enabled));pause.setAttribute('aria-pressed',String(paused));}
 // 只旋轉完整分子，沒有假造原子振動或物性數據。
 function render(){const wave=enabled?Math.sin(time*Number(speed.value)*Math.PI):0;molecule.rotation.set(.08,.12,wave*.2);field.visible=enabled;arrows.forEach(arrow=>{arrow.position.x=wave>=0?-10:10;arrow.setDirection(wave>=0?right:left);});renderer.render(scene,camera);}
 function animate(now){frame=0;if(!visible||document.hidden){last=0;return;}const moving=!paused&&(explicit||!reduced.matches&&document.body.dataset.storyMotion!=='reduced');if(moving)time+=last?Math.min((now-last)/1000,.05):0;last=now;render();if(moving)frame=requestAnimationFrame(animate);}
 function wake(){if(!frame)frame=requestAnimationFrame(animate);}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.position.z=(w/h<1?39:30)*zoom;camera.updateProjectionMatrix();renderer.setSize(w,h);render();}
 button.addEventListener('click',()=>{enabled=!enabled;explicit=enabled;time=0;labels();render();wake();});pause.addEventListener('click',()=>{paused=!paused;explicit=!paused;last=0;labels();wake();});speed.addEventListener('change',()=>{render();wake();});reset.addEventListener('click',()=>{view.rotation.set(0,0,0);zoom=1;resize();});
 document.querySelectorAll('[data-molecule-zoom]').forEach(control=>control.addEventListener('click',()=>{zoom=Math.max(.65,Math.min(1.45,zoom+Number(control.dataset.moleculeZoom)));resize();}));
 host.addEventListener('pointerdown',event=>{dragging=true;lastX=event.clientX;lastY=event.clientY;host.setPointerCapture(event.pointerId);});host.addEventListener('pointermove',event=>{if(!dragging)return;view.rotation.y+=(event.clientX-lastX)*.008;view.rotation.x=Math.max(-1.2,Math.min(1.2,view.rotation.x+(event.clientY-lastY)*.008));lastX=event.clientX;lastY=event.clientY;render();});['pointerup','pointercancel','lostpointercapture'].forEach(type=>host.addEventListener(type,()=>{dragging=false;}));
 new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)wake();}).observe(host);document.addEventListener('visibilitychange',wake);document.addEventListener('languagechange',labels);reduced.addEventListener('change',wake);labels();resize();
});
