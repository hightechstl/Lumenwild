import {dailyQuestPool,regionalQuests,storyQuests,weeklyQuestPool,type QuestDefinition} from './questData';
import type {GameState,QuestEvent,QuestRecord,QuestReward} from '../types';

export type QuestStatus='locked'|'active'|'claimable'|'claimed';
export interface QuestInstance extends QuestDefinition {instanceId:string;expiresAt?:number}

const DAY_MS=86_400_000;
const hash=(value:string)=>[...value].reduce((total,char)=>((total*33)^char.charCodeAt(0))>>>0,5381);
export const dailyKey=(now=Date.now())=>new Date(now).toISOString().slice(0,10);
export function weeklyKey(now=Date.now()){const date=new Date(now);const day=date.getUTCDay()||7;date.setUTCDate(date.getUTCDate()-day+1);return date.toISOString().slice(0,10)}
const endOfDay=(now:number)=>Date.parse(`${dailyKey(now)}T00:00:00.000Z`)+DAY_MS;
const endOfWeek=(now:number)=>Date.parse(`${weeklyKey(now)}T00:00:00.000Z`)+7*DAY_MS;

function choose(pool:QuestDefinition[],count:number,seed:string){return [...pool].sort((a,b)=>hash(`${seed}:${a.id}`)-hash(`${seed}:${b.id}`)).slice(0,count)}
export function questInstances(state:GameState,now=Date.now()):QuestInstance[]{
  const day=dailyKey(now),week=weeklyKey(now),player=state.player||'Wanderer';
  const daily=choose(dailyQuestPool,3,`${day}:${player}`).map(q=>({...q,instanceId:`daily:${day}:${q.id}`,expiresAt:endOfDay(now)}));
  const weekly=choose(weeklyQuestPool,3,`${week}:${player}`).map(q=>({...q,instanceId:`weekly:${week}:${q.id}`,expiresAt:endOfWeek(now)}));
  const fixed=[...regionalQuests,...storyQuests].map(q=>({...q,instanceId:q.id}));
  return [...daily,...weekly,...fixed];
}

export function hydrateQuestState(state:GameState,now=Date.now()):GameState{
  const activeIds=new Set(questInstances(state,now).map(q=>q.instanceId));
  const records=Object.fromEntries(Object.entries(state.questRecords??{}).filter(([id])=>activeIds.has(id)));
  for(const id of activeIds)records[id]=records[id]??{progress:0};
  return {...state,materials:state.materials??{},cosmetics:state.cosmetics??[],questRecords:records,questHistory:(state.questHistory??[]).slice(-200)};
}

export function questStatus(state:GameState,quest:QuestInstance):QuestStatus{
  const record=state.questRecords[quest.instanceId]??{progress:0};
  if(record.claimedAt)return 'claimed';
  if(quest.prerequisite&&!state.questRecords[quest.prerequisite]?.claimedAt)return 'locked';
  return record.progress>=quest.target?'claimable':'active';
}

export function recordQuestEvent(state:GameState,event:QuestEvent,amount=1,now=Date.now()):GameState{
  const fresh=hydrateQuestState(state,now);const records={...fresh.questRecords};
  for(const quest of questInstances(fresh,now)){
    if(quest.metric!==event||questStatus(fresh,quest)!=='active')continue;
    const record=records[quest.instanceId]??{progress:0};const progress=Math.min(quest.target,record.progress+Math.max(0,amount));
    records[quest.instanceId]={...record,progress,...(progress>=quest.target&&!record.completedAt?{completedAt:now}:{})};
  }
  return {...fresh,questRecords:records};
}

function applyReward(state:GameState,reward:QuestReward){
  const inventory=state.inventory.map(item=>({...item,quantity:item.quantity+(reward.items?.[item.id]??0)}));
  const materials={...state.materials};for(const [id,quantity] of Object.entries(reward.materials??{}))materials[id]=(materials[id]??0)+(quantity??0);
  const discoveredMaterials=[...new Set([...(state.discoveredMaterials??[]),...Object.keys(reward.materials??{})])];
  return {...state,dewdrops:state.dewdrops+(reward.marks??0),starpetals:state.starpetals+(reward.relicShards??0),inventory,materials,discoveredMaterials,cosmetics:reward.cosmetic?[...new Set([...state.cosmetics,reward.cosmetic])]:state.cosmetics};
}

export function claimQuest(state:GameState,instanceId:string,now=Date.now()):GameState{
  const fresh=hydrateQuestState(state,now);const quest=questInstances(fresh,now).find(q=>q.instanceId===instanceId);
  if(!quest||questStatus(fresh,quest)!=='claimable')return {...fresh,lastAction:'That quest reward is not ready to claim.'};
  const rewarded=applyReward(fresh,quest.reward);const record:QuestRecord={...rewarded.questRecords[instanceId],progress:quest.target,claimedAt:now};
  return {...rewarded,questRecords:{...rewarded.questRecords,[instanceId]:record},questHistory:[...new Set([...rewarded.questHistory,instanceId])].slice(-200),lastAction:`Quest complete: ${quest.title}. Rewards added to your field kit.`};
}

export function rewardSummary(reward:QuestReward){const parts:string[]=[];if(reward.marks)parts.push(`${reward.marks} Marks`);if(reward.relicShards)parts.push(`${reward.relicShards} Relic Shards`);for(const [id,n] of Object.entries(reward.items??{}))parts.push(`${n} ${id}`);for(const [id,n] of Object.entries(reward.materials??{}))parts.push(`${n} ${id}`);if(reward.cosmetic)parts.push(reward.cosmetic);return parts}
