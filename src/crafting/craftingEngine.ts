import type {GameState} from '../types';
import {activeCreature} from '../game';
import {recipes,recipeById} from './craftingData';
import {recordQuestEvent} from '../quests/questEngine';

const starterRecipes=['trail-kit','mossberry-offering'];
export function hydrateCraftingState(state:GameState):GameState{
 const discoveredMaterials=[...new Set([...(state.discoveredMaterials??[]),...Object.keys(state.materials??{}).filter(id=>(state.materials[id]??0)>0)])];
 const discoveredRecipes=[...new Set([...(state.discoveredRecipes??[]),...starterRecipes])];
 for(const recipe of recipes){
  if(recipe.unlock.kind==='material'&&recipe.unlock.id&&discoveredMaterials.includes(recipe.unlock.id))discoveredRecipes.push(recipe.id);
  if(recipe.unlock.kind==='discovery'&&recipe.unlock.id&&state.discoveries.includes(recipe.unlock.id as GameState['discoveries'][number]))discoveredRecipes.push(recipe.id);
 }
 return {...state,discoveredMaterials,discoveredRecipes:[...new Set(discoveredRecipes)]};
}

export function canCraft(state:GameState,recipeId:string,quantity=1){
 const fresh=hydrateCraftingState(state),recipe=recipeById[recipeId];
 if(!recipe||!fresh.discoveredRecipes.includes(recipeId)||!Number.isInteger(quantity)||quantity<1||quantity>10)return false;
 return Object.entries(recipe.materials).every(([id,cost])=>(fresh.materials[id]??0)>=cost*quantity)&&fresh.starpetals>=(recipe.relicShards??0)*quantity&&fresh.inventory.some(item=>item.id===recipe.outputItemId);
}

export function craft(state:GameState,recipeId:string,quantity=1):GameState{
 const fresh=hydrateCraftingState(state),recipe=recipeById[recipeId];
 if(!recipe||!fresh.discoveredRecipes.includes(recipeId))return {...fresh,lastAction:'That recipe is still hidden in the field journal.'};
 if(!Number.isInteger(quantity)||quantity<1||quantity>10)return {...fresh,lastAction:'Choose between 1 and 10 items for one crafting action.'};
 if(!canCraft(fresh,recipeId,quantity))return {...fresh,lastAction:'The workbench is missing part of that recipe. Nothing was spent.'};
 const materials={...fresh.materials};for(const[id,cost]of Object.entries(recipe.materials))materials[id]-=cost*quantity;
 const next={...fresh,materials,starpetals:fresh.starpetals-(recipe.relicShards??0)*quantity,inventory:fresh.inventory.map(item=>item.id===recipe.outputItemId?{...item,quantity:item.quantity+recipe.outputQuantity*quantity}:item),lastAction:`Crafted ${recipe.outputQuantity*quantity} × ${recipe.name}.`} as GameState;
 return recordQuestEvent(next,'craft',quantity);
}

export function useCraftedItem(state:GameState,itemId:string):GameState{
 const item=state.inventory.find(entry=>entry.id===itemId);if(!item?.quantity)return {...state,lastAction:'That item is not in your satchel.'};
 const companion=activeCreature(state);let energy=companion.energy,health=state.needs.health;
 if(itemId==='trail-kit')energy=Math.min(companion.maxEnergy,energy+20);else if(itemId==='brightroot-tonic'){energy=Math.min(companion.maxEnergy,energy+30);health=Math.min(100,health+15)}else return {...state,lastAction:'That item is used during another field activity.'};
 return {...state,needs:{...state.needs,energy,health},creatures:state.creatures.map(creature=>creature.id===companion.id?{...creature,energy,energyUpdatedAt:Date.now()}:creature),inventory:state.inventory.map(entry=>entry.id===itemId?{...entry,quantity:entry.quantity-1}:entry),lastAction:`${companion.name} used ${item.name}.`};
}
