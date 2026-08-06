import {describe,expect,it} from 'vitest';
import {initialState} from '../game';
import {migrateGameState,CURRENT_SCHEMA_VERSION} from '../firebase';
import {buyBasinSalve,gatherGlassroot,glassrootAvailable,surveyGlassroot} from './glassrootEngine';
import type {GameState} from '../types';
import type {GlassrootSpecies} from './glassrootData';

const DAY=Date.UTC(2026,7,6,12);
const unlocked=()=>{const base=initialState();return {...base,glassrootStoryStep:1,creatures:base.creatures.map(creature=>({...creature,energy:100})),needs:{...base.needs,energy:100}}};
function finish(state:GameState,species:GlassrootSpecies,goal:number,start:number){let next=state;for(let i=0;i<goal;i++){const now=start+i*86_400_000;next={...next,glassrootWeatherDate:new Date(now).toISOString().slice(0,10),glassrootWeather:'prism-squall',needs:{...next.needs,energy:100},creatures:next.creatures.map(creature=>creature.id===next.activeCreatureId?{...creature,energy:100}:creature)};next=surveyGlassroot(next,species,now)}return next}

describe('Glassroot Basin progression',()=>{
 it('remains locked until the Warden route or migrated story unlock',()=>{expect(glassrootAvailable(initialState(),'glintmoth',DAY).available).toBe(false);expect(glassrootAvailable(unlocked(),'glintmoth',DAY).available).toBe(true)});
 it('caps sustainable sifting and reveals useful recipes immediately',()=>{let state=unlocked();for(let i=0;i<4;i++)state=gatherGlassroot(state,DAY);expect(state.glassrootGatherPlays).toBe(3);expect(state.materials.glassreed).toBe(6);expect(state.materials.saltbloom).toBe(2);expect(state.discoveredRecipes).toContain('rootglass-stool')});
 it('makes Prismhart conditional on weather and story progression',()=>{const base=unlocked();const flint={...base,creatures:[...base.creatures,{...base.creatures[0],id:'flintcap-1',species:'flintcap' as const}]};expect(glassrootAvailable({...flint,glassrootWeatherDate:new Date(DAY).toISOString().slice(0,10),glassrootWeather:'clear'},'prismhart',DAY).available).toBe(false);expect(glassrootAvailable({...flint,glassrootWeatherDate:new Date(DAY).toISOString().slice(0,10),glassrootWeather:'prism-squall'},'prismhart',DAY).available).toBe(true)});
 it('supports complete progression through the guardian without a dead end',()=>{let state=unlocked();state=finish(state,'glintmoth',2,DAY);state=finish(state,'reedstalker',3,DAY+3*86_400_000);state=finish(state,'flintcap',3,DAY+7*86_400_000);state=finish(state,'prismhart',4,DAY+11*86_400_000);state=finish(state,'hollowhorn',5,DAY+16*86_400_000);expect(state.creatures.map(creature=>creature.species)).toEqual(expect.arrayContaining(['glintmoth','reedstalker','flintcap','prismhart','hollowhorn']));expect(state.achievements).toContain('Glassroot Guardian');expect(state.glassrootStoryStep).toBeGreaterThanOrEqual(6)});
 it('validates regional vendor purchases without overspending',()=>{const bought=buyBasinSalve({...unlocked(),dewdrops:70});expect(bought.dewdrops).toBe(0);expect(bought.inventory.find(item=>item.id==='basin-salve')?.quantity).toBe(1);expect(buyBasinSalve({...unlocked(),dewdrops:69}).dewdrops).toBe(69)});
});

describe('schema 12 migration',()=>{
 it('adds basin fields without changing an existing save',()=>{const old=initialState();const raw={...old,glassrootStoryStep:undefined,glassrootGatherDate:undefined,glassrootGatherPlays:undefined,glassrootWeatherDate:undefined,glassrootWeather:undefined};const migrated=migrateGameState(raw as unknown as GameState);expect(CURRENT_SCHEMA_VERSION).toBe(12);expect(migrated.glassrootStoryStep).toBe(0);expect(migrated.dewdrops).toBe(old.dewdrops);expect(migrated.creatures[0].bond).toBe(old.creatures[0].bond)});
});
