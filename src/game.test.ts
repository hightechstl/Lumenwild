import {describe,it,expect} from 'vitest';
import {befriendCragback,befriendGalecrest,befriendLateCreature,befriendMosskit,ENERGY_REGEN_MS,encounterAvailability,encounterTuning,initialState,care,buy,claimDaily,missEncounter,recoverState,refreshExpeditionState,selectCreature,studyEncounter} from './game';
import type {GameState,WildSpecies} from './types';

const DAY=Date.UTC(2026,0,1,12);
function surveyDays(state:GameState,species:WildSpecies,count:number){let s=state;for(let i=0;i<count;i++){const now=DAY+i*86_400_000;const date=new Date(now).toISOString().slice(0,10);s=studyEncounter({...s,encounterRotationDate:date,encounterRotation:[species]},species,now)}return s}

describe('economy and care rules',()=>{
  it('never overspends',()=>{const s={...initialState(),dewdrops:0};expect(buy(s,'lamp').inventory.find(i=>i.id==='lamp')?.quantity).toBe(0)});
  it('caps needs',()=>{let s=initialState();for(let i=0;i<10;i++)s=care(s,'feed');expect(s.needs.hunger).toBe(100)});
  it('pays daily once',()=>{let s={...initialState(),dailyCare:3};s=claimDaily(s);const once=s.dewdrops;expect(claimDaily(s).dewdrops).toBe(once)});
  it('starts a new account with 250 Marks',()=>expect(initialState().dewdrops).toBe(250));
});

describe('multi-day randomized expeditions',()=>{
  it('offers two deterministic randomized sightings on early field days',()=>{const s=refreshExpeditionState({...initialState(),fieldDays:[],encounterRotationDate:'',encounterRotation:[]},DAY);expect(s.encounterRotation).toHaveLength(2);expect(s.encounterRotation.every(x=>['mosskit','galecrest','cragback'].includes(x))).toBe(true);expect(refreshExpeditionState(s,DAY).encounterRotation).toEqual(s.encounterRotation)});
  it('introduces mythic and legendary species only after later field days',()=>{let s:GameState={...initialState(),fieldDays:[]};for(let i=0;i<7;i++)s=refreshExpeditionState({...s,encounterRotationDate:'',encounterRotation:[]},DAY+i*86_400_000);expect(s.fieldDays).toHaveLength(7);expect(s.encounterRotation).toHaveLength(3);const eligibleAcrossLateDays=new Set<WildSpecies>();for(let i=6;i<16;i++){const next=refreshExpeditionState({...s,encounterRotationDate:'',encounterRotation:[]},DAY+i*86_400_000);next.encounterRotation.forEach(x=>eligibleAcrossLateDays.add(x))}expect(eligibleAcrossLateDays.has('old-warden')).toBe(true)});
  it('allows only one trust increase per species per day',()=>{const date=new Date(DAY).toISOString().slice(0,10);let s={...initialState(),encounterRotationDate:date,encounterRotation:['mosskit'] as WildSpecies[]};s=studyEncounter(s,'mosskit',DAY);const once=s.encounterProgress.mosskit;s=studyEncounter(s,'mosskit',DAY+1000);expect(s.encounterProgress.mosskit).toBe(once);expect(encounterAvailability(s,'mosskit',DAY+1000).studied).toBe(true)});
  it('limits failed approaches to three per sighting day',()=>{const date=new Date(DAY).toISOString().slice(0,10);let s={...initialState(),creatures:initialState().creatures.map(x=>({...x,energy:100})),needs:{...initialState().needs,energy:100},encounterRotationDate:date,encounterRotation:['mosskit'] as WildSpecies[]};for(let i=0;i<4;i++)s=missEncounter(s,'mosskit',DAY+i);expect(s.dailyEncounterAttempts.mosskit).toBe(3);expect(s.needs.energy).toBe(64)});
});

describe('creature roster',()=>{
  it('requires three separate survey days before befriending Mosskit',()=>{let s=surveyDays(initialState(),'mosskit',3);expect(s.encounterDays.mosskit).toHaveLength(3);s=befriendMosskit(s);expect(s.creatures.map(x=>x.species)).toContain('mosskit')});
  it('consumes the offering and permit fee',()=>{let s=surveyDays(initialState(),'mosskit',3);const marks=s.dewdrops,tarts=s.inventory.find(x=>x.id==='tart')!.quantity;s=befriendMosskit(s);expect(s.dewdrops).toBe(marks-250);expect(s.inventory.find(x=>x.id==='tart')!.quantity).toBe(tarts-1)});
  it('blocks surveys when the companion is exhausted',()=>{const base=initialState();const date=new Date(DAY).toISOString().slice(0,10);const s={...base,creatures:base.creatures.map(x=>({...x,energy:11})),needs:{...base.needs,energy:11},encounterRotationDate:date,encounterRotation:['mosskit'] as WildSpecies[]};expect(studyEncounter(s,'mosskit',DAY).encounterProgress.mosskit).toBe(0)});
  it('never adds the same creature twice',()=>{let s=befriendMosskit(surveyDays(initialState(),'mosskit',3));expect(befriendMosskit(s).creatures).toHaveLength(2)});
  it('only selects an owned creature',()=>expect(selectCreature(initialState(),'missing').activeCreatureId).toBe('starter'));
});

describe('full progression costs',()=>{
  it('requires four Galecrest field days and Cloudfen supplies',()=>{let s={...initialState(),dewdrops:1000,creatures:initialState().creatures.map(x=>({...x,energy:1000,maxEnergy:1000})),inventory:initialState().inventory.map(x=>x.id==='tea'?{...x,quantity:2}:x)};s=surveyDays(s,'galecrest',4);s=befriendGalecrest(s);expect(s.creatures.map(x=>x.species)).toContain('galecrest');expect(s.dewdrops).toBe(500)});
  it('supports every later multi-day encounter',()=>{let s={...initialState(),dewdrops:10000,creatures:initialState().creatures.map(x=>({...x,energy:3000,maxEnergy:3000})),inventory:initialState().inventory.map(x=>({...x,quantity:10}))};s=befriendCragback(surveyDays(s,'cragback',5));s=befriendLateCreature(surveyDays(s,'emberstride',5),'emberstride');s=befriendLateCreature(surveyDays(s,'veilfin',6),'veilfin');s=befriendLateCreature(surveyDays(s,'old-warden',7),'old-warden');expect(s.creatures.map(x=>x.species)).toEqual(expect.arrayContaining(['cragback','emberstride','veilfin','old-warden']))});
});

describe('per-creature energy and attributes',()=>{
  it('recovers one Energy every five offline minutes',()=>{const s=initialState();const start=s.creatures[0].energyUpdatedAt;expect(recoverState(s,start+ENERGY_REGEN_MS*10).creatures[0].energy).toBe(74)});
  it('switches the active Energy pool',()=>{let s=initialState();s={...s,creatures:[...s.creatures,{...s.creatures[0],id:'second',name:'Second',energy:91}]};expect(selectCreature(s,'second').needs.energy).toBe(91)});
  it('makes stronger attributes meaningfully easier',()=>{const strong=encounterTuning(initialState('spriggle'),'mosskit'),weak=encounterTuning(initialState('bramblet'),'mosskit');expect(strong.windowPct).toBeGreaterThan(weak.windowPct);expect(strong.step).toBeLessThan(weak.step)});
  it('does not bypass timed Energy recovery through Study',()=>{const s=initialState();expect(care(s,'read').needs.energy).toBe(s.needs.energy)});
});
