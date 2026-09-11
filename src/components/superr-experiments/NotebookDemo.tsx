import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type CSSProperties } from 'react';
import colors from './colors.json';
const assets='/assets/superr-experiments/';
type Stroke = { id:number; points:string; color:string; width:number; opacity:number };
type Page = {id:number; title:string; section:string; marked:boolean; strokes:Stroke[]};
const initialPages:Page[]=[
  {id:1,title:'A little field guide',section:'Exploring the everyday',marked:false,strokes:[]},
  {id:2,title:'How a leaf catches light',section:'Exploring the everyday',marked:true,strokes:[]},
  {id:3,title:'Small things, big questions',section:'Things to wonder about',marked:false,strokes:[]},
  {id:4,title:'Ideas worth keeping',section:'Things to wonder about',marked:true,strokes:[]},
  {id:5,title:'Room for a new thought',section:'A fresh page',marked:false,strokes:[]},
];
type Edge='left'|'right'|'top'|'bottom';
export type NotebookMode='toolkit'|'toc'|'bookmarks'|'colorpad';
export function NotebookDemo({mode}:{mode:NotebookMode}) {
 const [pages,setPages]=useState(initialPages);const [pageId,setPageId]=useState(1);
 const [sidebar,setSidebar]=useState(mode==='toc'||mode==='bookmarks');const [tab,setTab]=useState(mode==='bookmarks'?'Bookmarks':'All Pages');
 const [edge,setEdge]=useState<Edge>('left');const [drag,setDrag]=useState<{x:number;y:number;edge:Edge}|null>(null);
 const [tool,setTool]=useState('Pen');const [color,setColor]=useState('#FF6F1E');const [palette,setPalette]=useState(['#000000','#0B7BFF','#FFD429','#0FB563','#FF6F1E','#FF66CF']);
 const [picker,setPicker]=useState<number|null>(mode==='colorpad'?2:null);const [size,setSize]=useState(4);const [uiHidden,setUiHidden]=useState(false);const [selectedPage,setSelectedPage]=useState<number|null>(null);const hold=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [pending,setPending]=useState<Stroke|null>(null);const [reorder,setReorder]=useState<number|null>(null);
 useEffect(()=>{setSidebar(mode==='toc'||mode==='bookmarks');setTab(mode==='bookmarks'?'Bookmarks':'All Pages');setPicker(mode==='colorpad'?2:null);},[mode]);
 const stage=useRef<HTMLDivElement>(null);const stroke=useRef<Stroke|null>(null);const sequence=useRef(0);
 const page=pages.find(p=>p.id===pageId)!;const pageIndex=pages.findIndex(p=>p.id===pageId);
 const update=(fn:(p:Page)=>Page)=>setPages(ps=>ps.map(p=>p.id===pageId?fn(p):p));
 const bookmark=(id:number)=>setPages(ps=>ps.map(p=>p.id===id?{...p,marked:!p.marked}:p));
 function point(e:ReactPointerEvent<SVGSVGElement>){const r=e.currentTarget.getBoundingClientRect();return `${((e.clientX-r.left)/r.width*720).toFixed(1)},${((e.clientY-r.top)/r.height*700).toFixed(1)}`;}
 function start(e:ReactPointerEvent<SVGSVGElement>){if(e.button!==0)return;e.currentTarget.setPointerCapture(e.pointerId);if(tool==='Eraser'){update(p=>({...p,strokes:p.strokes.slice(0,-1)}));return;}const p=point(e);stroke.current={id:++sequence.current,points:p+' '+p,color,width:tool==='Highlighter'?22:size,opacity:tool==='Highlighter'?.32:1};setPending({...stroke.current});}
 function move(e:ReactPointerEvent<SVGSVGElement>){if(!stroke.current)return;stroke.current.points+=' '+point(e);setPending({...stroke.current});}
 function finish(){if(stroke.current){const s=stroke.current;update(p=>({...p,strokes:[...p.strokes,s]}));}stroke.current=null;setPending(null);}
 function dragPosition(e:ReactPointerEvent){const r=stage.current!.getBoundingClientRect();const x=Math.max(0,Math.min(1200,(e.clientX-r.left)*1200/r.width)),y=Math.max(0,Math.min(1920,(e.clientY-r.top)*1920/r.height));const distances:{edge:Edge;d:number}[]=[{edge:'left',d:x},{edge:'right',d:1200-x},{edge:'top',d:y},{edge:'bottom',d:1920-y}];const best=distances.filter(v=>v.edge===edge||v.d<(v.edge==='left'||v.edge==='right'?1200:1920)*.3).sort((a,b)=>a.d-b.d)[0];return {x,y,edge:best.edge};}
 function movePage(id:number,delta:number){setPages(ps=>{const next=[...ps],i=next.findIndex(p=>p.id===id),j=i+delta;if(j<0||j>=next.length)return ps;[next[i],next[j]]=[next[j],next[i]];return next;});}
 const visible=tab==='Bookmarks'?pages.filter(p=>p.marked):pages;
 return <div className="sx-notebook" ref={stage}>
  {!uiHidden&&<header className="sx-book-header"><button aria-label="Close sidebar" onClick={()=>{setSidebar(false);setPicker(null);}}>×</button><div className="sx-native-header-tools"><button aria-label="Undo last stroke" disabled={!page.strokes.length} onClick={()=>update(p=>({...p,strokes:p.strokes.slice(0,-1)}))}>↶</button><button aria-label="Redo" disabled>↷</button><button aria-label="Notebook chat" onClick={()=>window.dispatchEvent(new Event('superr:open-chat'))}><img src={assets+'ic_ask_superr_chat.svg'} alt=""/></button><button aria-label="Toggle table of contents" aria-expanded={sidebar} onClick={()=>setSidebar(!sidebar)}><img src={assets+'ic_toc.svg'} alt=""/></button><button aria-label="Bookmark this page" aria-pressed={page.marked} onClick={()=>bookmark(pageId)}><img src={assets+(page.marked?'bookmark_filled.svg':'bookmark_unfilled.svg')} alt=""/></button><button aria-label="Hide notebook controls" onClick={()=>setUiHidden(true)}>◉</button></div></header>}
  {uiHidden&&<button className="sx-show-ui" onClick={()=>setUiHidden(false)}>Show controls</button>}
  {sidebar&&<button className="sx-toc-dismiss" aria-label="Dismiss table of contents" onClick={()=>setSidebar(false)}/>}
  {sidebar&&<aside className="sx-toc" aria-label="Table of contents"><div className="sx-toc-title"><h3>Field notes</h3><button aria-label="Close table of contents" onClick={()=>setSidebar(false)}>×</button></div><div className="sx-toc-tabs" role="tablist" aria-label="Page views">{['All Pages','Page Index','Bookmarks'].map(t=><button role="tab" aria-selected={tab===t} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div><div className={'sx-page-list '+(tab!=='Page Index'?'sx-page-grid':'')} role="tabpanel" aria-label={tab}>
    {visible.length===0?<p className="sx-empty">No bookmarks yet.<br/>Save a page using the ribbon above.</p>:visible.map((p,i)=><div key={p.id} draggable onDragStart={()=>setReorder(p.id)} onDragEnd={()=>setReorder(null)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(reorder===null)return;setPages(ps=>{const next=ps.filter(v=>v.id!==reorder);next.splice(next.findIndex(v=>v.id===p.id),0,ps.find(v=>v.id===reorder)!);return next;});setReorder(null);}} className="sx-page-row" data-current={p.id===pageId}>
      {tab==='Page Index'&&(i===0||visible[i-1].section!==p.section)&&<small className="sx-section-name">{p.section}</small>}
      <button className="sx-page-link" onContextMenu={e=>{e.preventDefault();setSelectedPage(p.id);}} onPointerDown={()=>{hold.current=setTimeout(()=>setSelectedPage(p.id),550);}} onPointerUp={()=>{if(hold.current)clearTimeout(hold.current);}} onPointerCancel={()=>{if(hold.current)clearTimeout(hold.current);}} aria-label={`Open page ${pages.findIndex(v=>v.id===p.id)+1}: ${p.title}`} onClick={()=>{setPageId(p.id);if(window.innerWidth<700)setSidebar(false);}}>{tab!=='Page Index'&&<span className="sx-mini-page"><span className="sx-mini-ink">{p.id===1?'A little thought…':p.title}</span>{p.marked&&<img className="sx-ribbon" src={assets+'bookmark_filled.svg'} alt=""/>}</span>}<span><b>{tab==='Page Index'?p.title:`Page ${pages.findIndex(v=>v.id===p.id)+1}${p.id===pageId?' (current)':''}`}</b></span></button>
      <div className="sx-page-actions" data-selected={selectedPage===p.id}><button aria-label={`${p.marked?'Unbookmark':'Bookmark'} ${p.title}`} aria-pressed={p.marked} onClick={()=>bookmark(p.id)}>{p.marked?'◆':'◇'}</button><button aria-label={`Move ${p.title} earlier`} disabled={pages[0].id===p.id} onClick={()=>movePage(p.id,-1)}>↑</button><button aria-label={`Move ${p.title} later`} disabled={pages[pages.length-1].id===p.id} onClick={()=>movePage(p.id,1)}>↓</button></div>
    </div>)}
  </div><footer>Hold a page to select · Drag to reorder</footer></aside>}
  <div className="sx-paper" data-sidebar={sidebar}>
   <div className="sx-paper-copy"><div className="sx-handwriting">{page.title}<br/>a thought worth keeping.</div></div>
   <svg className="sx-ink" aria-label="Notebook drawing surface" role="img" viewBox="0 0 720 700" preserveAspectRatio="none" onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={()=>{stroke.current=null;setPending(null);}}>{[...page.strokes,...(pending?[pending]:[])].map(s=><polyline key={s.id} points={s.points} fill="none" stroke={s.color} strokeWidth={s.width} strokeOpacity={s.opacity} strokeLinecap="round" strokeLinejoin="round"/>)}</svg>
  </div>
  {drag&&<div className="sx-dock-target" data-edge={drag.edge} aria-hidden="true"/>}
  <div hidden={uiHidden} className="sx-toolkit" data-edge={edge} data-dragging={!!drag} style={drag?{left:drag.x,top:drag.y,right:'auto',bottom:'auto',transform:'translate(-50%, -50%)'}:undefined}>
   <button className="sx-grip" aria-label="Drag toolkit; arrow keys dock to an edge" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setPicker(null);setDrag(dragPosition(e));}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))setDrag(dragPosition(e));}} onPointerUp={e=>{setEdge(dragPosition(e).edge);setDrag(null);}} onPointerCancel={()=>setDrag(null)} onKeyDown={e=>{const next=({ArrowLeft:'left',ArrowRight:'right',ArrowUp:'top',ArrowDown:'bottom'} as Record<string,Edge>)[e.key];if(next){e.preventDefault();setEdge(next);setPicker(null);}}}><span>⠿</span></button>
   <div className="sx-quick-colors">{palette.map((c,i)=><button key={i} aria-label={`Edit color ${i+1}`} aria-expanded={picker===i} style={{'--swatch':c} as CSSProperties} className={color===c?'is-selected':''} onClick={()=>{setColor(c);setPicker(picker===i?null:i);}}/>)}</div>
   {(['Pen','Highlighter','Geometry','Lasso','Eraser','Assets'] as const).map(t=><button key={t} className="sx-tool" aria-label={t} aria-pressed={tool===t} onClick={()=>{if(t==='Assets'){setPicker(picker===null?0:null);}else{setTool(t);setPicker(null);}}}><img alt="" src={assets+({Pen:'ic_ballpen',Highlighter:'ic_tools_highlighter',Eraser:'ic_eraser',Geometry:'ic_shapes',Lasso:'ic_lasso',Assets:'assets_menu'}[t])+'.svg'}/><span>{t}</span></button>)}
   <button hidden className="sx-undo" aria-label="Undo last stroke" disabled={!page.strokes.length} onClick={()=>update(p=>({...p,strokes:p.strokes.slice(0,-1)}))}>↶</button>
  </div>
  {picker!==null&&<div className="sx-colorpad" data-edge={edge} role="dialog" aria-label="Colorpad"><header><span>Colorpad</span><button aria-label="Close colorpad" onClick={()=>setPicker(null)}>×</button></header><div>{Array.from({length:63},(_,i)=>colors[(i%7)*9+Math.floor(i/7)]).map((c,i)=><button key={i} aria-label={`Select ${c}`} aria-pressed={color.toUpperCase()===c.toUpperCase()} style={{'--swatch':c} as CSSProperties} onClick={()=>{setColor(c);setPalette(p=>p.map((old,i)=>i===picker?c:old));setPicker(null);}}/>)}</div><footer hidden><span>Stroke width</span><input aria-label="Stroke width" type="range" min="1" max="10" value={size} onChange={e=>setSize(+e.target.value)}/></footer></div>}
  <footer className="sx-book-footer"><span aria-live="polite">Field notes</span><div><button aria-label="Previous page" disabled={pageIndex===0} onClick={()=>setPageId(pages[pageIndex-1].id)}>‹</button><span>Page {pageIndex+1}/{pages.length}</span><button aria-label="Next page" disabled={pageIndex===pages.length-1} onClick={()=>setPageId(pages[pageIndex+1].id)}>›</button></div></footer>
 </div>;
}
