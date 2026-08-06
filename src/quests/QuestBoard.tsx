import {useEffect,useMemo,useState} from 'react';
import {Check,Clock3,Gift,Lock,MapPinned,Sparkles} from 'lucide-react';
import type {GameState,QuestKind} from '../types';
import {claimQuest,hydrateQuestState,questInstances,questStatus,rewardSummary,type QuestInstance} from './questEngine';

const kindLabels:Record<QuestKind,string>={daily:'Daily',weekly:'Weekly',regional:'Regional',story:'Story'};
const materialNames:Record<string,string>={mossfiber:'Mossfiber',softmoss:'Soft Moss',cloudglass:'Cloudglass'};
const itemNames:Record<string,string>={tart:'Mossberry Tart',tea:'Sunpetal Tea',primer:'Moonleaf Primer',bell:'Tumblebell',beret:'Acorn Beret',lamp:'Firefly Lantern'};

function timeRemaining(expiresAt:number|undefined,now:number){if(!expiresAt)return 'Permanent';const hours=Math.max(0,Math.ceil((expiresAt-now)/3_600_000));return hours>=24?`${Math.ceil(hours/24)} days remaining`:`${hours} hours remaining`}
function rewardLabels(quest:QuestInstance){return rewardSummary(quest.reward).map(label=>{const [quantity,...rest]=label.split(' ');const id=rest.join(' ');return `${quantity} ${materialNames[id]??itemNames[id]??id}`})}

export function QuestBoard({state,act}:{state:GameState;act:(next:GameState)=>void}){
  const [filter,setFilter]=useState<QuestKind>('daily');
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),60_000);return()=>window.clearInterval(timer)},[]);
  const fresh=useMemo(()=>hydrateQuestState(state,now),[state,now]);
  const quests=useMemo(()=>questInstances(fresh,now),[fresh,now]);
  const visible=quests.filter(quest=>quest.kind===filter);
  const claimable=quests.filter(quest=>questStatus(fresh,quest)==='claimable').length;
  const claimed=quests.filter(quest=>questStatus(fresh,quest)==='claimed').length;
  const findTitle=(id?:string)=>quests.find(quest=>quest.instanceId===id||quest.id===id)?.title;
  return <section className="page quest-board">
    <header><p>Trailkeeper’s dispatch</p><h1>Quest Board</h1><span>Choose short errands, weekly expeditions, regional work, or the unfolding Bramblewake story.</span></header>
    <div className="quest-summary" aria-label="Quest summary">
      <article><b>{claimable}</b><span>Rewards ready</span></article><article><b>{claimed}</b><span>Claimed this cycle</span></article><article><b>{state.questHistory.length}</b><span>Completed overall</span></article>
    </div>
    <aside className="quest-field-kit" aria-label="Quest rewards held"><div><Gift/><span>Quest rewards held</span></div><p>{Object.keys(fresh.materials).length===0&&fresh.cosmetics.length===0?'Materials and cosmetics earned from quests will be recorded here.':null}{Object.entries(fresh.materials).map(([id,quantity])=><b key={id}>{materialNames[id]??id} ×{quantity}</b>)}{fresh.cosmetics.map(name=><b key={name}>{name}</b>)}</p></aside>
    <nav className="quest-tabs" aria-label="Quest categories">{(Object.keys(kindLabels) as QuestKind[]).map(kind=><button key={kind} className={filter===kind?'active':''} aria-current={filter===kind?'page':undefined} onClick={()=>setFilter(kind)}>{kind==='regional'?<MapPinned/>:kind==='story'?<Sparkles/>:<Clock3/>}{kindLabels[kind]}<small>{quests.filter(q=>q.kind===kind).length}</small></button>)}</nav>
    <div className="quest-cycle-note"><Clock3/><span>{filter==='daily'?'Daily assignments rotate at 00:00 UTC.':filter==='weekly'?'Weekly expeditions rotate every Monday at 00:00 UTC.':'These quests do not expire.'}</span></div>
    <div className="quest-list">{visible.map(quest=>{const record=fresh.questRecords[quest.instanceId]??{progress:0};const status=questStatus(fresh,quest);const percent=Math.min(100,record.progress/quest.target*100);return <article className={`quest-card ${status}`} key={quest.instanceId}>
      <div className="quest-card-top"><div><small>{quest.region??(quest.chapter?`Chapter ${quest.chapter}`:kindLabels[quest.kind])}</small><h2>{quest.title}</h2></div><span className={`quest-status ${status}`}>{status==='locked'?<><Lock/> Locked</>:status==='active'?'Active':status==='claimable'?<><Gift/> Completed · Claimable</>:<><Check/> Claimed</>}</span></div>
      <p>{quest.description}</p>
      {status==='locked'?<p className="quest-prerequisite"><Lock/> Complete “{findTitle(quest.prerequisite)??'the previous quest'}” first.</p>:<><div className="quest-progress"><i><em style={{width:`${percent}%`}}/></i><b>{Math.min(record.progress,quest.target)}/{quest.target}</b></div><small className="quest-expiry">{timeRemaining(quest.expiresAt,now)}</small></>}
      <div className="quest-rewards"><span>Rewards</span>{rewardLabels(quest).map(label=><b key={label}>{label}</b>)}</div>
      {status==='claimable'?<button className="primary" onClick={()=>act(claimQuest(fresh,quest.instanceId,now))}><Gift/> Claim rewards</button>:status==='claimed'?<button disabled><Check/> Reward claimed</button>:null}
    </article>})}</div>
  </section>
}
