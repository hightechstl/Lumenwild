import type {GameState,QuestReward} from '../types';
import {materials,recipes} from '../crafting/craftingData';
import {regions,speciesEntries} from './journalData';

export type AchievementCategory='Discovery'|'Bonds'|'Regions'|'Quests'|'Crafting'|'Expeditions';
export interface AchievementTier {id:string;label:string;target:number;reward:QuestReward}
export interface AchievementDefinition {id:string;title:string;category:AchievementCategory;description:string;value:(state:GameState)=>number;tiers:AchievementTier[]}
const tiers=(id:string,targets:number[],rewards:QuestReward[]):AchievementTier[]=>targets.map((target,index)=>({id:`${id}-${index+1}`,label:['Bronze','Silver','Gold'][index],target,reward:rewards[index]}));
export const achievementDefinitions:AchievementDefinition[]=[
 {id:'naturalist',title:'Living Catalogue',category:'Discovery',description:'Discover creatures across the wilds.',value:s=>s.discoveries.length,tiers:tiers('naturalist',[3,7,11],[{marks:80},{relicShards:3},{marks:350,cosmetic:'Master Naturalist Folio'}])},
 {id:'companions',title:'Circle of Trust',category:'Bonds',description:'Befriend creatures and welcome them to camp.',value:s=>s.creatures.length,tiers:tiers('companions',[2,5,10],[{marks:100},{relicShards:4},{cosmetic:'Kindred Camp Pennant',marks:300}])},
 {id:'kindred',title:'Kindred Paths',category:'Bonds',description:'Reach bond 50 with different companions.',value:s=>s.creatures.filter(c=>c.bond>=50).length,tiers:tiers('kindred',[1,4,8],[{marks:60},{relicShards:4},{cosmetic:'Golden Bond Clasp'}])},
 {id:'cartographer',title:'Archipelago Cartographer',category:'Regions',description:'Complete regional field records.',value:s=>regions.filter(r=>r.complete(s)).length,tiers:tiers('cartographer',[1,3,5],[{marks:100},{relicShards:5},{marks:400,cosmetic:'Archipelago Mapcloth'}])},
 {id:'questkeeper',title:'Board Keeper',category:'Quests',description:'Claim completed quests.',value:s=>s.questHistory.length,tiers:tiers('questkeeper',[3,12,30],[{marks:75},{relicShards:4},{marks:350,cosmetic:'Questkeeper Seal'}])},
 {id:'maker',title:'Patient Maker',category:'Crafting',description:'Discover recipes at the workbench.',value:s=>s.discoveredRecipes.length,tiers:tiers('maker',[3,6,9],[{marks:70},{relicShards:4},{cosmetic:'Masterwork Tool Wrap'}])},
 {id:'collector',title:'Field Collector',category:'Crafting',description:'Discover regional materials.',value:s=>s.discoveredMaterials.length,tiers:tiers('collector',[2,5,8],[{marks:60},{relicShards:3},{marks:250,cosmetic:'Specimen Satchel'}])},
 {id:'surveyor',title:'Trail Surveyor',category:'Expeditions',description:'Complete successful creature approaches.',value:s=>s.encounterHistory.filter(e=>e.result==='success').length,tiers:tiers('surveyor',[3,12,30],[{marks:90},{relicShards:5},{marks:400,cosmetic:'Surveyor’s Lantern Badge'}])},
];
export function rewardLabel(reward:QuestReward){return [reward.marks&&`${reward.marks} Marks`,reward.relicShards&&`${reward.relicShards} Relic Shards`,reward.cosmetic].filter(Boolean).join(' · ')}
export function claimAchievement(state:GameState,achievementId:string,tierId:string):GameState{
 const achievement=achievementDefinitions.find(entry=>entry.id===achievementId),tier=achievement?.tiers.find(entry=>entry.id===tierId);
 if(!achievement||!tier||state.claimedAchievementTiers.includes(tier.id)||achievement.value(state)<tier.target)return {...state,lastAction:'That achievement reward is not ready.'};
 const reward=tier.reward;return {...state,dewdrops:state.dewdrops+(reward.marks??0),starpetals:state.starpetals+(reward.relicShards??0),cosmetics:reward.cosmetic?[...new Set([...state.cosmetics,reward.cosmetic])]:state.cosmetics,claimedAchievementTiers:[...state.claimedAchievementTiers,tier.id],achievements:[...new Set([...state.achievements,`${achievement.title} · ${tier.label}`])],lastAction:`${achievement.title} ${tier.label} claimed: ${rewardLabel(reward)}.`};
}
export function journalSummary(state:GameState){return {species:{value:state.discoveries.length,total:speciesEntries.length},regions:{value:regions.filter(r=>r.complete(state)).length,total:regions.length},materials:{value:state.discoveredMaterials.length,total:materials.length},recipes:{value:state.discoveredRecipes.length,total:recipes.length},quests:state.questHistory.length,bondMilestones:state.creatures.reduce((n,c)=>n+[25,50,75,100].filter(x=>c.bond>=x).length,0)}}
