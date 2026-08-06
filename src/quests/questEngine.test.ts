import {describe,expect,it} from 'vitest';
import {buy,care,initialState,awardForage} from '../game';
import {claimQuest,dailyKey,hydrateQuestState,questInstances,questStatus,recordQuestEvent,weeklyKey} from './questEngine';

const DAY=Date.UTC(2026,0,5,12);

describe('quest generation and resets',()=>{
  it('generates three varied daily and weekly quests deterministically',()=>{const s=hydrateQuestState(initialState(),DAY);const first=questInstances(s,DAY);expect(first.filter(q=>q.kind==='daily')).toHaveLength(3);expect(first.filter(q=>q.kind==='weekly')).toHaveLength(3);expect(questInstances(s,DAY).map(q=>q.instanceId)).toEqual(first.map(q=>q.instanceId));expect(new Set(first.filter(q=>q.kind==='daily').map(q=>q.metric)).size).toBeGreaterThan(1)});
  it('offers different daily combinations across a week',()=>{const s=initialState();const combinations=new Set(Array.from({length:7},(_,day)=>questInstances(s,DAY+day*86_400_000).filter(q=>q.kind==='daily').map(q=>q.id).sort().join(',')));expect(combinations.size).toBeGreaterThan(2)});
  it('rotates daily instances and removes expired progress',()=>{let s=hydrateQuestState(initialState(),DAY);const oldDaily=questInstances(s,DAY).find(q=>q.kind==='daily')!;s={...s,questRecords:{...s.questRecords,[oldDaily.instanceId]:{progress:99}}};const tomorrow=hydrateQuestState(s,DAY+86_400_000);expect(tomorrow.questRecords[oldDaily.instanceId]).toBeUndefined();expect(dailyKey(DAY)).not.toBe(dailyKey(DAY+86_400_000))});
  it('uses Monday-based weekly cycles',()=>{expect(weeklyKey(Date.UTC(2026,0,5))).toBe('2026-01-05');expect(weeklyKey(Date.UTC(2026,0,11))).toBe('2026-01-05');expect(weeklyKey(Date.UTC(2026,0,12))).toBe('2026-01-12')});
});

describe('quest progression and prerequisites',()=>{
  it('advances every active quest listening for an event',()=>{const s=recordQuestEvent(initialState(),'care',1,DAY);const activeCare=questInstances(s,DAY).filter(q=>q.metric==='care'&&questStatus(s,q)!=='locked');expect(activeCare.length).toBeGreaterThan(0);expect(activeCare.every(q=>s.questRecords[q.instanceId].progress===1)).toBe(true)});
  it('does not advance locked story steps',()=>{const s=recordQuestEvent(initialState(),'forage',10,DAY);expect(s.questRecords['story-2'].progress).toBe(0)});
  it('unlocks the next story step only after claiming its prerequisite',()=>{let s=initialState();for(let i=0;i<3;i++)s=care(s,'feed',DAY+i);expect(questStatus(s,questInstances(s,DAY).find(q=>q.id==='story-1')!)).toBe('claimable');s=claimQuest(s,'story-1',DAY+10);expect(questStatus(s,questInstances(s,DAY).find(q=>q.id==='story-2')!)).toBe('active')});
  it('tracks purchases and forage through existing game actions',()=>{let s=buy(initialState(),'tart');s=awardForage(s,50,DAY);const quests=questInstances(s,DAY);const purchase=quests.filter(q=>q.metric==='purchase'&&questStatus(s,q)!=='locked');const forage=quests.filter(q=>q.metric==='forage'&&questStatus(s,q)!=='locked');expect(purchase.every(q=>s.questRecords[q.instanceId].progress===1)).toBe(true);expect(forage.every(q=>s.questRecords[q.instanceId].progress===1)).toBe(true)});
});

describe('quest claiming and rewards',()=>{
  it('awards Marks and a cosmetic exactly once',()=>{let s=hydrateQuestState(initialState(),DAY);s={...s,questRecords:{...s.questRecords,'story-1':{progress:3,completedAt:DAY}}};s=claimQuest(s,'story-1',DAY+1);expect(s.dewdrops).toBe(350);expect(s.cosmetics).toContain('Pressed Fern Page');const once=s.dewdrops;s=claimQuest(s,'story-1',DAY+2);expect(s.dewdrops).toBe(once)});
  it('supports material, item, and Relic Shard rewards',()=>{let s=hydrateQuestState(initialState(),DAY);s={...s,questRecords:{...s.questRecords,'story-1':{progress:3,claimedAt:DAY},'story-2':{progress:2,completedAt:DAY}}};s=claimQuest(s,'story-2',DAY+1);expect(s.materials.mossfiber).toBe(2);expect(s.starpetals).toBe(14);s={...s,questRecords:{...s.questRecords,'story-3':{progress:1,completedAt:DAY}}};s=claimQuest(s,'story-3',DAY+2);expect(s.inventory.find(item=>item.id==='primer')?.quantity).toBe(1)});
  it('refuses locked or incomplete claims',()=>{const s=hydrateQuestState(initialState(),DAY);expect(claimQuest(s,'story-2',DAY).dewdrops).toBe(s.dewdrops);expect(claimQuest(s,'story-1',DAY).dewdrops).toBe(s.dewdrops)});
});
