import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DeviceViewport } from './DeviceViewport';
import { Avatar, AvatarSwitcher } from './AvatarSwitcher';
import { NotebookDemo, type NotebookMode } from './NotebookDemo';
import './superr-experiments.css';
const demos=[
 {id:'profile',name:'Profile icons',hint:'A face for every mood. Open the tray and choose yours.'},
 {id:'toolkit',name:'Draggable toolkit',hint:'Grab the dotted handle and move your tools to any edge. Then try a stroke.'},
 {id:'toc',name:'Table of contents',hint:'Find a page, switch views, or drag the pages into a new order.'},
 {id:'bookmarks',name:'Bookmarks',hint:'Keep a page close. Add a bookmark, revisit it, or remove it.'},
 {id:'colorpad',name:'Colorpad',hint:'Choose a swatch, make it yours, and leave a little color on the page.'},
 {id:'periodic',name:'Periodic table',hint:'Explore the elements, highlight a family, and peek inside an atom.'},
] as const;
type Demo=typeof demos[number]['id'];
function isOpenUrl(){return new URL(location.href).searchParams.get('experiment')==='superr-interactive-draft';}
export function SuperrInteractiveDraft({reducedMotion}:{reducedMotion:boolean}){
 const [open,setOpen]=useState(isOpenUrl);const [active,setActive]=useState<Demo>('profile');const [reset,setReset]=useState(0);
 const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);const pushed=useRef(false);
 const current=demos.find(d=>d.id===active)!;
 function close(){if(pushed.current){history.back();pushed.current=false;}else{const u=new URL(location.href);u.searchParams.delete('experiment');history.replaceState(null,'',u);}setOpen(false);}
 useEffect(()=>{const pop=()=>setOpen(isOpenUrl());window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 useEffect(()=>{if(!open)return;const d=dialog.current;if(!d)return;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';d.showModal();return()=>{d.close();document.body.style.overflow=overflow;trigger.current?.focus({preventScroll:true});};},[open]);
 useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.origin===location.origin&&e.data==='superr:close-periodic')setActive('profile');};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
 return <>
  <button ref={trigger} className="sx-card" data-cursor-keep onClick={()=>{const u=new URL(location.href);u.searchParams.set('experiment','superr-interactive-draft');history.pushState(null,'',u);pushed.current=true;setOpen(true);}} aria-label="Open Superr experiments">
   <span className="sx-card-meta"><span><img src="/assets/invoice-folio/superr-current-mark.svg" alt=""/> Superr / exp</span><small>INTERACTIVE EXPLORATIONS</small></span>
   <span className="sx-card-art" aria-hidden="true">{['happy','laughing','normal','wink','uu'].map((id,i)=><span key={id} style={{transform:`rotate(${[-12,8,-5,10,-9][i]}deg)`}}><Avatar id={id}/></span>)}</span>
   <span className="sx-card-bottom"><span><strong>Small details.<br/>A lot to play with.</strong><small>Selected interactions from SuperrBook.</small></span><span className="sx-card-cta">Try them out ↗</span></span>
  </button>
  {open&&createPortal(<dialog ref={dialog} className="sx-dialog" aria-labelledby="sx-title" data-cursor-keep onCancel={e=>{e.preventDefault();close();}}>
   <header className="sx-top"><div><span>SUPERR / EXP</span><h2 id="sx-title">Little things, brought to life.</h2></div><button autoFocus aria-label="Close Superr experiments" onClick={close}>×</button></header>
   <nav className="sx-nav" aria-label="Superr experiments">{demos.map((d,i)=><button key={d.id} aria-current={active===d.id?'page':undefined} onClick={()=>setActive(d.id)}><small>{String(i+1).padStart(2,'0')}</small>{d.name}</button>)}</nav>
   <div className="sx-description"><p>{current.hint}</p><button onClick={()=>setReset(r=>r+1)}>Reset demo ↺</button></div>
   <div className="sx-stage" key={reset}><DeviceViewport landscape={active==='periodic'}>{active==='profile'?<AvatarSwitcher reducedMotion={reducedMotion}/>:active==='periodic'?<iframe title="Interactive periodic table" src="/assets/superr-experiments/periodic-table/index.html"/>:<NotebookDemo mode={active as NotebookMode}/>}</DeviceViewport></div>
   <footer className="sx-caption"><span>SuperrBook, in your browser.</span><span>{active==='periodic'?'1920 × 1200 · Landscape':'1200 × 1920 · SuperrBook'}</span></footer>
  </dialog>,document.body)}
 </>;
}
