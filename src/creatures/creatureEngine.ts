import type {GameState, OwnedCreature, WildSpecies} from '../types';
import {bondLevel, creatureProfiles, milestoneIds, type CareAction} from './creatureData';

const dayKey=(now=Date.now())=>new Date(now).toISOString().slice(0,10);

export function hydrateCreature(creature:OwnedCreature):OwnedCreature{
  return {...creature,abilityUsedDate:creature.abilityUsedDate??'',personalQuestClaimed:creature.personalQuestClaimed??false,unlockedMilestones:[...new Set([...(creature.unlockedMilestones??[]),...milestoneIds(creature.bond)])]};
}
export function hydrateCreatureState(state:GameState):GameState{return {...state,creatures:state.creatures.map(hydrateCreature)}}
export function careBondBonus(creature:OwnedCreature,action:CareAction){return creatureProfiles[creature.species].preferredCare===action?2:0}
export function encounterRoleBonus(creature:OwnedCreature,species:WildSpecies){const profile=creatureProfiles[creature.species];return profile.encounterSpecies.includes(species)?profile.encounterBonus+(creature.bond>=90?3:creature.bond>=50?1:0):0}
export function forageBenefits(creature:OwnedCreature,plays:number,earned:number){const gathering=creatureProfiles[creature.species].gathering;const materials:Record<string,number>={};if(gathering.material&&gathering.quantity){const allowed=creature.species==='galecrest'?earned>=80:creature.species==='cragback'||creature.species==='old-warden'?plays>=2:creature.species==='veilfin'?plays>=1:true;if(allowed)materials[gathering.material]=gathering.quantity}return {materials,marksBonus:Math.floor(earned*(gathering.marksPercent??0)/100)};}
export function energyRegenMs(creature:OwnedCreature,base:number){return Math.round(base/creatureProfiles[creature.species].energyRegenMultiplier)}

export function activateCreatureAbility(state:GameState,creatureId=state.activeCreatureId,now=Date.now()):GameState{
  const creature=state.creatures.find(entry=>entry.id===creatureId);if(!creature)return state;
  if(creature.id!==state.activeCreatureId)return {...state,lastAction:'Choose this creature as your active companion first.'};
  if(creature.abilityUsedDate===dayKey(now))return {...state,lastAction:`${creatureProfiles[creature.species].active.name} is ready again tomorrow.`};
  const ability=creatureProfiles[creature.species].active;let next={...state,creatures:state.creatures.map(entry=>entry.id===creature.id?{...entry,abilityUsedDate:dayKey(now)}:entry)} as GameState;
  if(ability.kind==='energy'){const energy=Math.min(creature.maxEnergy,creature.energy+ability.amount);next={...next,needs:{...next.needs,energy},creatures:next.creatures.map(entry=>entry.id===creature.id?{...entry,energy,energyUpdatedAt:now}:entry)}}
  if(ability.kind==='marks')next={...next,dewdrops:next.dewdrops+ability.amount};
  if(ability.kind==='trail-kit')next={...next,inventory:next.inventory.map(item=>item.id==='trail-kit'?{...item,quantity:item.quantity+ability.amount}:item)};
  if(ability.kind==='material'&&ability.material==='relic-shard')next={...next,starpetals:next.starpetals+ability.amount};
  else if(ability.kind==='material'&&ability.material)next={...next,materials:{...next.materials,[ability.material]:(next.materials[ability.material]??0)+ability.amount},discoveredMaterials:[...new Set([...next.discoveredMaterials,ability.material])]};
  return {...next,lastAction:`${creature.name} used ${ability.name}. ${ability.description}`};
}

export function claimCreatureQuest(state:GameState,creatureId:string):GameState{
  const creature=state.creatures.find(entry=>entry.id===creatureId);if(!creature)return state;const profile=creatureProfiles[creature.species];
  if(creature.personalQuestClaimed)return {...state,lastAction:`${profile.quest.title} is already recorded in the journal.`};
  if(creature.bond<profile.quest.bondGoal)return {...state,lastAction:`Build ${creature.name}’s bond to ${profile.quest.bondGoal} to finish this story.`};
  const cosmetic=`${profile.quest.reward} · ${creature.name}`;
  return {...state,creatures:state.creatures.map(entry=>entry.id===creatureId?{...entry,personalQuestClaimed:true,unlockedMilestones:[...new Set([...entry.unlockedMilestones,...milestoneIds(entry.bond)])]}:entry),cosmetics:[...new Set([...state.cosmetics,cosmetic])],starpetals:state.starpetals+2,lastAction:`${profile.quest.title} complete: ${profile.quest.reward} and 2 Relic Shards unlocked.`};
}

export function creatureProgressSummary(creature:OwnedCreature){const profile=creatureProfiles[creature.species];const level=bondLevel(creature.bond);const loreUnlocked=Math.min(4,milestoneIds(creature.bond).length);return {profile,level,loreUnlocked,questReady:creature.bond>=profile.quest.bondGoal&&!creature.personalQuestClaimed};}
