import {describe,expect,it} from 'vitest';
import {initialState,encounterTuning,missEncounter,studyEncounter} from '../game';
import type {GameState,Species,WildSpecies} from '../types';
import {assistanceLevel,encounterProfiles,encounterRound} from './encounterData';

const DAY=Date.UTC(2026,6,1,12);const species=Object.keys(encounterProfiles) as WildSpecies[];
describe('encounter template registry',()=>{
 it('assigns all six species across exactly three reusable mechanics',()=>{expect(new Set(species.map(id=>encounterProfiles[id].template))).toEqual(new Set(['timing','observation','route']));expect(species).toHaveLength(6)});
 it('selects mechanics by species behavior and region',()=>{expect(encounterProfiles.mosskit.template).toBe('observation');expect(encounterProfiles.galecrest.template).toBe('timing');expect(encounterProfiles.cragback.template).toBe('route');expect(encounterProfiles['old-warden'].region).toBe('The Ruins')});
 it('provides deterministic, valid choice rounds for observation and route species',()=>{for(const id of ['mosskit','veilfin','cragback','old-warden'] as WildSpecies[]){const round=encounterRound(id,7)!;expect(round.choices).toHaveLength(3);expect(round.correct).toBeGreaterThanOrEqual(0);expect(round.correct).toBeLessThan(3);expect(encounterRound(id,7)).toEqual(round)}});
 it('uses the intended creature statistic for every mechanic',()=>{expect(encounterProfiles.mosskit.attribute).toBe('tracking');expect(encounterProfiles.galecrest.attribute).toBe('agility');expect(encounterProfiles.cragback.attribute).toBe('resolve')});
});

describe('weak and strong matchups',()=>{
 it.each([['spriggle','bramblet','mosskit'],['spriggle','mallowisp','galecrest'],['bramblet','spriggle','cragback']] as [Species,Species,WildSpecies][])('makes the stronger %s matchup clearer than %s for %s',(strongSpecies,weakSpecies,wild)=>{const strong=encounterTuning(initialState(strongSpecies),wild),weak=encounterTuning(initialState(weakSpecies),wild);expect(strong.score).toBeGreaterThan(weak.score);expect(strong.guidance).toBeGreaterThanOrEqual(weak.guidance)});
 it('classifies large advantages and disadvantages transparently',()=>{expect(assistanceLevel(95,70)).toBe('strong');expect(assistanceLevel(65,70)).toBe('matched');expect(assistanceLevel(40,70)).toBe('challenging')});
});

describe('recoverable consequences and supplies',()=>{
 const sighting=(state:GameState,id:WildSpecies)=>({...state,encounterRotationDate:new Date(DAY).toISOString().slice(0,10),encounterRotation:[id],creatures:state.creatures.map(creature=>({...creature,energy:100})),needs:{...state.needs,energy:100}});
 it('automatically consumes one Trail Kit only after a failed approach',()=>{const base=initialState();const prepared=sighting({...base,inventory:base.inventory.map(item=>item.id==='trail-kit'?{...item,quantity:2}:item)},'mosskit');const failed=missEncounter(prepared,'mosskit',DAY);expect(failed.inventory.find(item=>item.id==='trail-kit')?.quantity).toBe(1);expect(failed.needs.energy).toBe(96);const success=studyEncounter(prepared,'mosskit',DAY);expect(success.inventory.find(item=>item.id==='trail-kit')?.quantity).toBe(2);expect(success.needs.energy).toBe(88)});
 it('charges the normal failure cost when no kit is available',()=>{const failed=missEncounter(sighting(initialState(),'mosskit'),'mosskit',DAY);expect(failed.needs.energy).toBe(88)});
 it('allows retry attempts after failure and resets the limit on a later day',()=>{let state=sighting(initialState(),'mosskit');state=missEncounter(state,'mosskit',DAY);expect(state.dailyEncounterAttempts.mosskit).toBe(1);state=missEncounter(state,'mosskit',DAY+1);expect(state.dailyEncounterAttempts.mosskit).toBe(2);const tomorrow=DAY+86_400_000;state=missEncounter({...state,encounterRotationDate:new Date(tomorrow).toISOString().slice(0,10),encounterRotation:['mosskit']},'mosskit',tomorrow);expect(state.dailyEncounterAttempts.mosskit).toBe(1)});
 it('never consumes a kit when an approach is unavailable',()=>{const base=initialState();const unavailable={...base,inventory:base.inventory.map(item=>item.id==='trail-kit'?{...item,quantity:1}:item),encounterRotation:[]};expect(missEncounter(unavailable,'mosskit',DAY).inventory.find(item=>item.id==='trail-kit')?.quantity).toBe(1)});
});
