import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import avatars from './avatars.json';
export const avatarOrder = ['happy', 'laughing', 'normal', 'wink', 'sunglasses', 'stare', 'uu', 'eyepatch', 'default'];
export function Avatar({ id, className }: { id: string; className?: string }) {
  const a = avatars.find(a => a.id === id) ?? avatars[0];
  return <svg className={className} viewBox="0 0 52 52" aria-hidden="true"><path d={a.basePath} fill={a.color}/><path d={a.eyesPath} fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/><path d={a.outlinePath} fill="black"/></svg>;
}
export function AvatarSwitcher({ reducedMotion }: { reducedMotion: boolean }) {
  const [selected, setSelected] = useState('sunglasses');
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dismiss = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);
  return <div className="sx-profile-demo" ref={root}>
    <div className="sx-profile-heading"><span>My Notes <i>Classes</i> <i>Library</i></span><span className="sx-home-search" aria-hidden="true">⌕</span><button ref={trigger} className="sx-avatar-trigger" aria-label="Change profile icon" aria-expanded={open} onClick={() => setOpen(!open)}><Avatar id={selected}/></button></div>
    <div className="sx-home-actions"><span>▣ &nbsp;Notebook</span><span>▱ &nbsp;Folder</span><i>⋮</i></div>
    <div className="sx-home-books" aria-hidden="true">{['quick notes','Field notes','Little discoveries','My notebook','Ideas','The everyday','Things to try','Science','A fresh page'].map((name,i)=><div className={'sx-home-book sx-home-book-'+i} key={name}><span>{name}</span></div>)}</div>
    <AnimatePresence>{open && <motion.div className="sx-avatar-tray" role="group" aria-label="Profile icons" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onKeyDown={e => {if(e.key === 'Escape'){e.stopPropagation();setOpen(false);trigger.current?.focus();}}}>
      {avatarOrder.map((id, i) => <motion.button key={id} aria-label={`${id} profile icon`} aria-pressed={selected === id} style={{'--avatar-color': avatars.find(a=>a.id===id)?.color} as CSSProperties} initial={reducedMotion ? false : {opacity:0,x:(8-i)*114,scale:1}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:20}} transition={{duration:reducedMotion ? 0 : .2,ease:[.05,.7,.1,1]}} onClick={()=>{setSelected(id);setOpen(false);trigger.current?.focus();}}><Avatar id={id}/></motion.button>)}
    </motion.div>}</AnimatePresence>

  </div>;
}
