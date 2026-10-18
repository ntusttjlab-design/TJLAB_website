'use strict';
// Album photos are supplied only from verified content/lab_activities.json.
document.addEventListener('DOMContentLoaded', () => {
 const dialog=document.getElementById('activity-lightbox');
 const image=document.getElementById('activity-lightbox-image');
 const caption=document.getElementById('activity-lightbox-caption');
 const heading=document.getElementById('activity-lightbox-title');
 const counter=document.getElementById('activity-lightbox-counter');
 const previous=document.getElementById('activity-lightbox-prev');
 const next=document.getElementById('activity-lightbox-next');
 const close=document.getElementById('activity-lightbox-close');
 if(!dialog||!image||!caption||!heading||!counter||!previous||!next||!close)return;
 let active=-1,opener=null;
 const items=()=>[...document.querySelectorAll('button.activity-photo[data-activity-photo]')];
 const lang=()=>document.documentElement.lang==='en'?'en':'zh';
 function localize(item,key){return item.dataset[key+(lang()==='en'?'En':'Zh')]||'';}
 function update(){
  const photos=items(),item=photos[active];
  if(!item)return;
  const thumbnail=item.querySelector('img');
  if(!thumbnail)return;
  image.src=thumbnail.getAttribute('src');
  image.alt=localize(item,'alt');
  heading.textContent=localize(item,'title');
  caption.textContent=localize(item,'caption');
  counter.textContent=(active+1)+' / '+photos.length;
  previous.disabled=photos.length<2;
  next.disabled=photos.length<2;
  close.setAttribute('aria-label',lang()==='en'?'Close photo':'關閉照片');
  dialog.setAttribute('aria-label',lang()==='en'?'Photo preview':'照片預覽');
 }
 function open(item){
  const photos=items();
  active=photos.indexOf(item);
  if(active<0)return;
  opener=item;
  update();
  if(!dialog.open)dialog.showModal();
  close.focus();
 }
 function shift(delta){
  const photos=items();
  if(photos.length===0)return;
  active=(active+delta+photos.length)%photos.length;
  update();
 }
 document.addEventListener('click',event=>{
  const item=event.target.closest('button.activity-photo[data-activity-photo]');
  if(item)open(item);
 });
 previous.addEventListener('click',()=>shift(-1));
 next.addEventListener('click',()=>shift(1));
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{
  image.removeAttribute('src');
  opener?.focus({preventScroll:true});
  active=-1;
 });
 dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){event.preventDefault();shift(-1);}
  if(event.key==='ArrowRight'){event.preventDefault();shift(1);}
 });
 document.addEventListener('languagechange',()=>{
  document.querySelectorAll('button.activity-photo[data-activity-photo]').forEach(button=>{
   const thumb=button.querySelector('img');
   if(thumb)thumb.alt=localize(button,'alt');
   button.setAttribute('aria-label',localize(button,'caption'));
  });
  if(active>=0)update();
 });
});
