import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
/** Native device pixels, scaled as a single plane. Never reflow the Android UI. */
export function DeviceViewport({landscape=false,recording=false,children}:{landscape?:boolean;recording?:boolean;children:ReactNode}){
 const host=useRef<HTMLDivElement>(null);const [scale,setScale]=useState(.35);
 const width=landscape?1920:1200,height=landscape?1200:1920;
 useLayoutEffect(()=>{const el=host.current!;const measure=()=>setScale(Math.min((el.clientWidth-24)/width,(el.clientHeight-24)/height));measure();const ro=new ResizeObserver(measure);ro.observe(el);return()=>ro.disconnect();},[width,height]);
 return <div className="sx-device-host" ref={host}><div className="sx-device-frame" style={{width:width*scale,height:height*scale}}>{recording?children:<div className="sx-device-screen" data-orientation={landscape?'landscape':'portrait'} style={{width,height,transform:`scale(${scale})`}}>{children}</div>}</div></div>;
}
