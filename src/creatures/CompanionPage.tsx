import {Check, Heart, Lock, Map, Sparkles} from 'lucide-react';
import type {GameState} from '../types';
import {selectCreature} from '../game';
import {activateCreatureAbility,claimCreatureQuest,creatureProgressSummary} from './creatureEngine';
import {bondMilestones} from './creatureData';

const asset=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`;
const imageFor=(species:string)=>['spriggle','mallowisp','bramblet'].includes(species)?`${species}.png`:`creature-${species}.png`;

export function CompanionPage({state,act}:{state:GameState;act:(state:GameState)=>void}){
 return <section className="page companion-page">
  <header><p>Bond fieldbook</p><h1>Companion paths</h1><span>Every creature brings a different way to travel. Grow trust, learn their story, and choose the right partner for each expedition.</span></header>
  <div className="role-note"><Map/><div><b>No single best companion</b><span>Pathfinders reveal clues, runners master timing, guardians hold difficult routes, and gatherers reshape expedition supplies.</span></div></div>
  <div className="companion-grid">{state.creatures.map(creature=>{const {profile,level,loreUnlocked,questReady}=creatureProgressSummary(creature);const active=creature.id===state.activeCreatureId;const abilityReady=creature.abilityUsedDate!==new Date().toISOString().slice(0,10);return <article className={active?'companion-card active':'companion-card'} key={creature.id}>
   <div className="companion-heading"><img src={asset(imageFor(creature.species))} alt={creature.name}/><div><small>{profile.role} · {profile.region}</small><h2>{creature.name}</h2><span>{level.name} · Bond {creature.bond}/100</span></div>{active&&<i><Check/> Active</i>}</div>
   <div className="bond-track"><i style={{width:`${creature.bond}%`}}/><div>{bondMilestones.map(mark=><span className={creature.bond>=mark?'earned':''} style={{left:`${mark}%`}} key={mark} aria-label={`${mark} bond milestone`}/>)}</div></div>
   <div className="identity-grid"><p><b>Field role</b>{profile.passive}</p><p><b>Regional strength</b>{profile.encounterSpecies.join(' · ')} challenges gain +{profile.encounterBonus}</p><p><b>Gathering</b>{profile.gathering.description}</p><p><b>Care preference</b>Favorite: {profile.favoriteFood}; enjoys {profile.favoriteActivity.toLowerCase()}.</p></div>
   <section className="ability-card"><Sparkles/><div><b>{profile.active.name}</b><span>{profile.active.description} Once per day.</span></div><button disabled={!active||!abilityReady} onClick={()=>act(activateCreatureAbility(state,creature.id))}>{!active?'Travel together first':abilityReady?'Use ability':'Ready tomorrow'}</button></section>
   {!active&&<button className="travel-button" onClick={()=>act(selectCreature(state,creature.id))}>Travel with {creature.name}</button>}
   <section className="personal-quest"><Heart/><div><small>Personal creature quest</small><h3>{profile.quest.title}</h3><p>{profile.quest.description}</p><span>Reward: {profile.quest.reward} + 2 Relic Shards</span><progress max={profile.quest.bondGoal} value={Math.min(creature.bond,profile.quest.bondGoal)}/><b>{Math.min(creature.bond,profile.quest.bondGoal)}/{profile.quest.bondGoal} bond</b></div><button disabled={!questReady} onClick={()=>act(claimCreatureQuest(state,creature.id))}>{creature.personalQuestClaimed?'Claimed':questReady?'Complete quest':'Locked'}</button></section>
   <div className="bond-lore"><h3>Journal lore</h3>{profile.lore.map((entry,index)=><p className={index<loreUnlocked?'':'locked'} key={entry}>{index<loreUnlocked?entry:<><Lock/> Bond {bondMilestones[index]} entry</>}</p>)}</div>
  </article>})}</div>
 </section>
}
