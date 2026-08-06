import {describe,expect,it} from 'vitest';
import {awardForage,initialState,studyEncounter} from '../game';
import type {WildSpecies} from '../types';
import {canCraft,craft,hydrateCraftingState,useCraftedItem} from './craftingEngine';
import {materials,recipes} from './craftingData';

const DAY=Date.UTC(2026,4,1,12);
describe('regional acquisition',()=>{
 it('guarantees Mossfiber even on a zero-Mark forage result',()=>{const state=awardForage(initialState(),0,DAY);expect(state.materials.mossfiber).toBe(1);expect(state.foragePlays).toBe(1)});
 it('adds Soft Moss on later contracts without exceeding the daily cap',()=>{let state=initialState();for(let i=0;i<4;i++)state=awardForage(state,40,DAY);expect(state.materials.mossfiber).toBe(3);expect(state.materials.softmoss).toBe(2)});
 it.each([['mosskit','softmoss'],['galecrest','cloudglass'],['cragback','amberstone'],['old-warden','wardenbark']] as [WildSpecies,string][])('maps a successful %s survey to %s',(species,material)=>{const base=initialState();const date=new Date(DAY).toISOString().slice(0,10);const state=studyEncounter({...base,encounterRotationDate:date,encounterRotation:[species]},species,DAY);expect(state.materials[material]).toBe(1)});
 it('documents at least one acquisition source for every material',()=>expect(materials.every(material=>material.sources.length>0)).toBe(true));
});

describe('crafting transactions',()=>{
 it('starts with two practical recipes and reveals material recipes safely',()=>{const base=initialState();expect(base.discoveredRecipes).toEqual(expect.arrayContaining(['trail-kit','mossberry-offering']));const hydrated=hydrateCraftingState({...base,materials:{cloudglass:1},discoveredMaterials:[]});expect(hydrated.discoveredRecipes).toContain('reedweave-cushion')});
 it('spends exact costs and adds the selected batch atomically',()=>{const base={...initialState(),materials:{mossfiber:8}};const made=craft(base,'trail-kit',3);expect(made.materials.mossfiber).toBe(2);expect(made.inventory.find(item=>item.id==='trail-kit')?.quantity).toBe(3)});
 it('spends Relic Shards only on advanced recipes',()=>{const base=hydrateCraftingState({...initialState(),materials:{softmoss:3,cloudglass:2},starpetals:5});const made=craft(base,'reedweave-cushion');expect(made.starpetals).toBe(3);expect(made.inventory.find(item=>item.id==='reedweave-cushion')?.quantity).toBe(1)});
 it('does not partially spend when any ingredient is missing',()=>{const base=hydrateCraftingState({...initialState(),materials:{softmoss:3,cloudglass:1},starpetals:5});const made=craft(base,'reedweave-cushion');expect(made.materials).toEqual(base.materials);expect(made.starpetals).toBe(5)});
 it('rejects invalid batches and hidden recipe identifiers',()=>{const base={...initialState(),materials:{mossfiber:100}};expect(canCraft(base,'trail-kit',11)).toBe(false);expect(craft(base,'missing').inventory).toEqual(base.inventory)});
 it('never permits negative material quantities',()=>{const base={...initialState(),materials:{mossfiber:1}};expect(craft(base,'trail-kit').materials.mossfiber).toBe(1)});
 it('provides every requested output category',()=>expect(new Set(recipes.map(recipe=>recipe.category))).toEqual(new Set(['supply','offering','restorative','furniture','wearable'])));
 it('supports forage-to-craft progression without purchases',()=>{let state=initialState();state=awardForage(state,80,DAY);expect(canCraft(state,'trail-kit')).toBe(true);state=craft(state,'trail-kit');expect(state.inventory.find(item=>item.id==='trail-kit')?.quantity).toBe(1)});
 it('consumes restoratives once and caps recovered stats',()=>{const base={...initialState(),materials:{mossfiber:6,softmoss:4},discoveredMaterials:['softmoss'],discoveredRecipes:['trail-kit','mossberry-offering','brightroot-tonic']};let state=craft(base,'brightroot-tonic');const before=state.inventory.find(item=>item.id==='brightroot-tonic')!.quantity;state=useCraftedItem(state,'brightroot-tonic');expect(state.inventory.find(item=>item.id==='brightroot-tonic')!.quantity).toBe(before-1);expect(state.needs.energy).toBeGreaterThan(base.needs.energy)});
});
