import {useEffect,useRef,useState} from 'react';
import {Compass,Heart,Map,NotebookTabs,Sparkles,X} from 'lucide-react';

const GUIDE_KEY='lumenwild-first-journey-v1';
const steps=[
  {eyebrow:'Welcome to Lumenwild',title:'Care for your companion',body:'Your companion’s needs change as you play. Feed, groom, train, and study from Home to keep Hunger, Mood, Energy, Health, and Bond strong.',hint:'Start with any care action on the Home screen.',Icon:Heart},
  {eyebrow:'Build a daily rhythm',title:'Follow your quest board',body:'Daily quests turn ordinary care and fieldwork into Marks, supplies, and long-term progress. Check Quests whenever you need a clear next objective.',hint:'The Home card shows your current daily routine at a glance.',Icon:NotebookTabs},
  {eyebrow:'Venture beyond camp',title:'Explore the floating wilds',body:'Open Explore to forage in Mossmere, play field challenges, discover regions, and find the day’s randomized creature sightings.',hint:'Forage Runs are a reliable first source of Marks.',Icon:Map},
  {eyebrow:'Grow your field team',title:'Earn a creature’s trust',body:'Wild creatures are befriended over several encounters. Bring enough Energy, the requested offering, and Marks—then build trust one field attempt at a time.',hint:'Use Creatures to review encounters and choose who travels with you.',Icon:Compass},
] as const;

export function FirstJourneyGuide(){
  const[open,setOpen]=useState(false),[step,setStep]=useState(0);
  const nextRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(localStorage.getItem(GUIDE_KEY)!=='complete')queueMicrotask(()=>setOpen(true))},[]);
  useEffect(()=>{if(!open)return;nextRef.current?.focus();const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){localStorage.setItem(GUIDE_KEY,'complete');setOpen(false)}};addEventListener('keydown',onKey);return()=>removeEventListener('keydown',onKey)},[open,step]);
  const dismiss=()=>{localStorage.setItem(GUIDE_KEY,'complete');setOpen(false)};
  const current=steps[step],last=step===steps.length-1,Icon=current.Icon;
  return <>
    <button className="journey-help" aria-label="Open Lumenwild guide" onClick={()=>{setStep(0);setOpen(true)}}><Sparkles/><span>Guide</span></button>
    {open?<div className="journey-guide-backdrop">
      <section className="journey-guide" role="dialog" aria-modal="true" aria-labelledby="journey-guide-title" aria-describedby="journey-guide-copy">
        <button className="journey-guide-close" aria-label="Skip guide" onClick={dismiss}><X/></button>
        <div className="journey-guide-icon"><Icon aria-hidden="true"/></div>
        <p className="journey-guide-eyebrow">{current.eyebrow}</p>
        <h2 id="journey-guide-title">{current.title}</h2>
        <p id="journey-guide-copy" className="journey-guide-copy">{current.body}</p>
        <p className="journey-guide-hint"><Sparkles aria-hidden="true"/>{current.hint}</p>
        <div className="journey-guide-progress" aria-label={`Step ${step+1} of ${steps.length}`}>{steps.map((entry,index)=><i key={entry.title} className={index<=step?'complete':''}/>)}</div>
        <div className="journey-guide-actions">
          {step?<button className="journey-guide-back" onClick={()=>setStep(value=>value-1)}>Back</button>:<button className="journey-guide-skip" onClick={dismiss}>Skip for now</button>}
          <button ref={nextRef} className="primary" onClick={()=>last?dismiss():setStep(value=>value+1)}>{last?'Begin exploring':'Next step'}</button>
        </div>
      </section>
    </div>:null}
  </>;
}
