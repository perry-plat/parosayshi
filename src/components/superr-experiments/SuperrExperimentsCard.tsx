import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar } from './AvatarSwitcher';
import { DeviceViewport } from './DeviceViewport';
import './superr-experiments.css';
const demos=[
 {id:'profile',name:'Profile icons',hint:'A face for every mood. The original profile switcher, captured on SuperrBook.'},
 {id:'toolkit',name:'Draggable toolkit',hint:'Tools that move with you. Watch the toolkit settle against the edges of the page.'},
 {id:'toc',name:'Table of contents',hint:'A notebook at a glance. Page previews, an index, and a quick way back into your notes.'},
 {id:'bookmarks',name:'Bookmarks',hint:'A small ribbon for the pages you want to come back to.'},
 {id:'colorpad',name:'Colorpad',hint:'A pocketful of color, right beside your pen.'},
 {id:'periodic',name:'Periodic table',hint:'Try this one yourself. Choose an element or highlight a family.'},
 {id:'chat',name:'Notebook AI chat',hint:'Ask Superr, without leaving the notebook.'},
] as const;
type Demo=typeof demos[number]['id'];
const base='/assets/superr-experiments/recordings/';
function isOpenUrl(){return new URL(location.href).searchParams.get('experiment')==='superr';}
export function SuperrExperimentsCard({reducedMotion}:{reducedMotion:boolean}){
 const [open,setOpen]=useState(isOpenUrl);const [active,setActive]=useState<Demo>('profile');const [reset,setReset]=useState(0);
 const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);const pushed=useRef(false);
 const current=demos.find(d=>d.id===active)!;
 function close(){if(pushed.current){history.back();pushed.current=false;}else{const u=new URL(location.href);u.searchParams.delete('experiment');history.replaceState(null,'',u);}setOpen(false);}
 useEffect(()=>{const pop=()=>setOpen(isOpenUrl());window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 useEffect(()=>{if(!open)return;const d=dialog.current;if(!d)return;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';d.showModal();return()=>{d.close();document.body.style.overflow=overflow;trigger.current?.focus({preventScroll:true});};},[open]);
 useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===location.origin&&e.data==='superr:close-periodic')setActive('profile');};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
 return <>
  <button ref={trigger} className="sx-card" data-cursor-keep onClick={()=>{const u=new URL(location.href);u.searchParams.set('experiment','superr');history.pushState(null,'',u);pushed.current=true;setOpen(true);}} aria-label="Open Superr experiments">
   <span className="sx-card-meta"><span><img src="/assets/invoice-folio/superr-current-mark.svg" alt=""/> Superr / exp</span><small>DETAILS IN MOTION</small></span>
   <span className="sx-card-art" aria-hidden="true">{['happy','laughing','normal','wink','uu'].map((id,i)=><span key={id} style={{transform:`rotate(${[-12,8,-5,10,-9][i]}deg)`}}><Avatar id={id}/></span>)}</span>
   <span className="sx-card-bottom"><span><strong>Small details.<br/>A lot to play with.</strong><small>Selected interactions from SuperrBook.</small></span><span className="sx-card-cta">Watch & explore ↗</span></span>
  </button>
  {open&&createPortal(<dialog ref={dialog} className="sx-dialog" aria-labelledby="sx-title" data-cursor-keep onCancel={e=>{e.preventDefault();close();}}>
   <header className="sx-top"><div><span>SUPERR / EXP</span><h2 id="sx-title">Little things, brought to life.</h2></div><button autoFocus aria-label="Close Superr experiments" onClick={close}>×</button></header>
   <nav className="sx-nav" aria-label="Superr experiments">{demos.map((d,i)=><button key={d.id} aria-current={active===d.id?'page':undefined} onClick={()=>setActive(d.id)}><small>{String(i+1).padStart(2,'0')}</small>{d.name}</button>)}</nav>
   <div className="sx-description"><p>{current.hint}</p>{active==='periodic'?<button onClick={()=>setReset(r=>r+1)}>Reset ↺</button>:<span className="sx-recording-label">DEVICE RECORDING</span>}</div>
   <div className="sx-stage" key={reset}><DeviceViewport landscape={active==='periodic'} recording={active!=='periodic'}>{active==='periodic'?<iframe title="Interactive periodic table" src="/assets/superr-experiments/periodic-table/index.html"/>:<video key={active} className="sx-device-video" aria-label={`${current.name} on SuperrBook`} autoPlay={!reducedMotion} muted loop playsInline controls preload="metadata" poster={`${base}${active}.jpg`} src={`${base}${active}.mp4`}/>}</DeviceViewport></div>
   <footer className="sx-caption"><span>{active==='periodic'?'Interactive · Original HTML5 book':'Captured on SuperrBook · Original UI'}</span><span>{active==='periodic'?'8:5 · Landscape':'5:8 · Portrait'}</span></footer>
  </dialog>,document.body)}
 </>;
}
