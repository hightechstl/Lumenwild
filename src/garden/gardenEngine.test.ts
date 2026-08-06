import {describe,expect,it} from 'vitest';import {initialState} from '../game';import {assistGarden,gardenProgress,harvestPlot,hydrateGardenState,plantSeed,waterPlot} from './gardenEngine';
const NOW=Date.UTC(2026,7,6,12);
describe('homestead garden',()=>{
 it('hydrates four plots and recoverable starter seeds without changing economy',()=>{const base=initialState();const state=hydrateGardenState({...base,gardenPlots:undefined,seeds:undefined,discoveredSeeds:undefined} as any,NOW);expect(state.gardenPlots).toHaveLength(4);expect(state.seeds.mossberry).toBe(3);expect(state.dewdrops).toBe(base.dewdrops)});
 it('plants, waters, and never withers after excessive elapsed time',()=>{let state=plantSeed(initialState(),0,'mossberry',NOW);state=waterPlot(state,0,NOW+1);expect(gardenProgress(state,state.gardenPlots[0],NOW+365*86_400_000)).toBe(1);expect(harvestPlot(state,0,NOW+365*86_400_000).seeds.mossberry).toBe(3)});
 it('does not duplicate harvests',()=>{const planted=plantSeed(initialState(),0,'mossberry',NOW),first=harvestPlot(planted,0,NOW+86_400_000),again=harvestPlot(first,0,NOW+86_400_001);expect(again.seeds.mossberry).toBe(first.seeds.mossberry);expect(again.materials.softmoss).toBe(first.materials.softmoss)});
 it('handles clock rollback without negative growth',()=>{const state=plantSeed(initialState(),0,'mossberry',NOW);expect(gardenProgress(state,state.gardenPlots[0],NOW-1000)).toBe(0)});
 it('limits creature assistance to once per UTC day',()=>{let state=plantSeed(initialState(),0,'mossberry',NOW);state=assistGarden(state,0,NOW);const next=plantSeed(state,1,'mossberry',NOW);expect(assistGarden(next,1,NOW).gardenPlots[1].assisted).not.toBe(true)});
});
