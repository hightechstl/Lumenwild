import {describe,expect,it} from 'vitest';
import {initialState} from '../game';
import {claimAchievement,journalSummary} from './journalEngine';

describe('field journal achievements',()=>{
 it('derives progress from the actual saved record',()=>{const state={...initialState(),discoveries:['mosskit','galecrest','cragback'] as any,discoveredMaterials:['mossfiber','softmoss'],questHistory:['one','two']};expect(journalSummary(state)).toMatchObject({species:{value:3,total:11},materials:{value:2,total:8},quests:2})});
 it('claims an earned tier once and preserves unrelated progression',()=>{const base={...initialState(),discoveries:['mosskit','galecrest','cragback'] as any,dewdrops:500};const claimed=claimAchievement(base,'naturalist','naturalist-1');expect(claimed.dewdrops).toBe(580);expect(claimed.claimedAchievementTiers).toEqual(['naturalist-1']);expect(claimAchievement(claimed,'naturalist','naturalist-1')).toMatchObject({dewdrops:580,claimedAchievementTiers:['naturalist-1']})});
 it('rejects locked or unknown reward claims',()=>{const base=initialState();expect(claimAchievement(base,'naturalist','naturalist-3').dewdrops).toBe(base.dewdrops);expect(claimAchievement(base,'missing','missing-1').claimedAchievementTiers).toEqual([])});
});
