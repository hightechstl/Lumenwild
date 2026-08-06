import {useMemo,useState} from 'react';
import {Hammer,Lock,Sparkles,MapPin,PackageOpen} from 'lucide-react';
import type {GameState} from '../types';
import {canCraft,craft,hydrateCraftingState} from './craftingEngine';
import {materialById,materials,recipes} from './craftingData';

const filters=['all','supply','offering','restorative','furniture','wearable'] as const;
export function CraftingPage({state,act}:{state:GameState;act:(state:GameState)=>void}){
 const[filter,setFilter]=useState<typeof filters[number]>('all');const[amounts,setAmounts]=useState<Record<string,number>>({});
 const field=hydrateCraftingState(state);
 const shown=useMemo(()=>recipes.filter(recipe=>filter==='all'||recipe.category===filter),[filter]);
 return <section className="page crafting-page"><header><p>Field workbench</p><h1>Crafting journal</h1><span>Turn regional finds into practical expedition goods and keepsakes.</span></header>
  <section className="material-ledger" aria-label="Regional material ledger">{materials.map(material=>{const found=field.discoveredMaterials.includes(material.id);return <article className={found?'':'unknown'} key={material.id}><i>{found?material.icon:'?'}</i><div><small>{found?`${material.rarity} · ${material.region}`:'Undiscovered material'}</small><b>{found?material.name:'Unknown find'}</b><span>{found?material.sources.join(' · '):'Explore new trails to reveal its sources.'}</span></div><strong>{found?field.materials[material.id]??0:'—'}</strong></article>})}</section>
  <div className="craft-toolbar"><div role="group" aria-label="Recipe category">{filters.map(value=><button className={filter===value?'active':''} aria-pressed={filter===value} key={value} onClick={()=>setFilter(value)}>{value}</button>)}</div><span><Sparkles/> {state.starpetals} Relic Shards</span></div>
  <div className="recipe-grid">{shown.map(recipe=>{const unlocked=state.discoveredRecipes.includes(recipe.id),quantity=amounts[recipe.id]??1;return <article className={unlocked?'recipe-card':'recipe-card locked'} key={recipe.id}>{unlocked?<Hammer/>:<Lock/>}<small>{unlocked?recipe.category:'Hidden recipe'}</small><h2>{unlocked?recipe.name:'Field notes incomplete'}</h2><p>{unlocked?recipe.description:recipe.hint}</p>{unlocked&&<><div className="recipe-costs">{Object.entries(recipe.materials).map(([id,cost])=><span className={(state.materials[id]??0)>=cost*quantity?'':'missing'} key={id}>{materialById[id]?.icon} {cost*quantity} {materialById[id]?.name}<small>have {state.materials[id]??0}</small></span>)}{!!recipe.relicShards&&<span className={state.starpetals>=recipe.relicShards*quantity?'':'missing'}><Sparkles/> {recipe.relicShards*quantity} Relic Shards<small>have {state.starpetals}</small></span>}</div><div className="craft-action"><label>Quantity<select aria-label={`${recipe.name} quantity`} value={quantity} onChange={event=>setAmounts({...amounts,[recipe.id]:Number(event.target.value)})}>{[1,2,3,4,5,10].map(n=><option key={n}>{n}</option>)}</select></label><button disabled={!canCraft(state,recipe.id,quantity)} onClick={()=>act(craft(state,recipe.id,quantity))}><PackageOpen/> Craft {quantity}</button></div></>}</article>})}</div>
  <aside className="acquisition-note"><MapPin/><div><b>No blocked trails</b><p>Every Mossmere contract awards Mossfiber, while later contracts add Soft Moss. Regional survey successes grant their matching material; quest rewards remain an alternate Cloudglass route.</p></div></aside>
 </section>
}
