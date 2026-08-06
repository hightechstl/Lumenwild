import type {ItemCategory,WildSpecies} from '../types';

export type MaterialRarity='Common'|'Uncommon'|'Rare';
export interface MaterialDefinition {id:string;name:string;icon:string;rarity:MaterialRarity;region:string;sources:string[]}
export interface RecipeDefinition {id:string;name:string;category:ItemCategory;description:string;outputItemId:string;outputQuantity:number;materials:Record<string,number>;relicShards?:number;unlock:{kind:'starter'|'material'|'discovery';id?:string};hint:string}

export const materials:MaterialDefinition[]=[
 {id:'mossfiber',name:'Mossfiber',icon:'🌿',rarity:'Common',region:'Mossmere',sources:['Every Mossmere forage contract','Quest rewards']},
 {id:'softmoss',name:'Soft Moss',icon:'🍃',rarity:'Common',region:'Mossmere',sources:['Second and third daily forage contracts','Mossmere encounters','Quest rewards']},
 {id:'cloudglass',name:'Cloudglass',icon:'💠',rarity:'Uncommon',region:'Cloudfen',sources:['Successful Galecrest or Veilfin surveys','Quest rewards']},
 {id:'amberstone',name:'Amberstone',icon:'🟠',rarity:'Uncommon',region:'Amber Reach',sources:['Successful Cragback or Emberstride surveys']},
 {id:'wardenbark',name:'Wardenbark',icon:'🪵',rarity:'Rare',region:'The Ruins',sources:['Successful Old Warden surveys']},
 {id:'glassreed',name:'Glassreed',icon:'🪻',rarity:'Common',region:'Glassroot Basin',sources:['Prism-pool sifting','Glintmoth and Reedstalker surveys']},
 {id:'saltbloom',name:'Saltbloom',icon:'❀',rarity:'Uncommon',region:'Glassroot Basin',sources:['Later sifting contracts','Flintcap surveys']},
 {id:'rootpearl',name:'Root Pearl',icon:'◉',rarity:'Rare',region:'Glassroot Basin',sources:['Prism squalls','Prismhart and Hollowhorn surveys']},
];

export const recipes:RecipeDefinition[]=[
 {id:'trail-kit',name:'Mossmere Trail Kit',category:'supply',description:'Restores 20 Energy to the active companion.',outputItemId:'trail-kit',outputQuantity:1,materials:{mossfiber:2},unlock:{kind:'starter'},hint:'Included in every first field kit.'},
 {id:'mossberry-offering',name:'Mossberry Offering',category:'offering',description:'A crafted offering accepted in place of a Mossberry Tart.',outputItemId:'mossberry-offering',outputQuantity:1,materials:{mossfiber:2,softmoss:1},unlock:{kind:'starter'},hint:'Included in every first field kit.'},
 {id:'brightroot-tonic',name:'Brightroot Tonic',category:'restorative',description:'Restores 30 Energy and 15 Health.',outputItemId:'brightroot-tonic',outputQuantity:1,materials:{mossfiber:3,softmoss:2},unlock:{kind:'material',id:'softmoss'},hint:'Gather Soft Moss from a later daily forage contract.'},
 {id:'reedweave-cushion',name:'Reedweave Cushion',category:'furniture',description:'Adds a handwoven cushion to every nook theme.',outputItemId:'reedweave-cushion',outputQuantity:1,materials:{softmoss:3,cloudglass:2},relicShards:2,unlock:{kind:'material',id:'cloudglass'},hint:'Study a Cloudfen creature or earn Cloudglass from quests.'},
 {id:'wayfinder-mantle',name:'Wayfinder Mantle',category:'wearable',description:'A field-journal mantle your active companion can equip.',outputItemId:'wayfinder-mantle',outputQuantity:1,materials:{mossfiber:4,amberstone:3},relicShards:3,unlock:{kind:'material',id:'amberstone'},hint:'Record a successful Amber Reach survey.'},
 {id:'warden-compass',name:'Warden Compass',category:'supply',description:'A rare keepsake tuned to the oldest regional trails.',outputItemId:'warden-compass',outputQuantity:1,materials:{cloudglass:2,amberstone:2,wardenbark:2},relicShards:5,unlock:{kind:'discovery',id:'old-warden' satisfies WildSpecies},hint:'Discover the guardian of the Ruins.'},
 {id:'rootglass-stool',name:'Rootglass Stool',category:'furniture',description:'A luminous seat for the nook.',outputItemId:'rootglass-stool',outputQuantity:1,materials:{glassreed:4,saltbloom:2},relicShards:2,unlock:{kind:'material',id:'saltbloom'},hint:'Sift the Glassroot pools for Saltbloom.'},
 {id:'prism-cloak',name:'Prism-Rain Cloak',category:'wearable',description:'A wearable reward woven for prism squalls.',outputItemId:'prism-cloak',outputQuantity:1,materials:{glassreed:5,rootpearl:2},relicShards:4,unlock:{kind:'material',id:'rootpearl'},hint:'Find a Root Pearl during a prism squall.'},
 {id:'hollowhorn-chime',name:'Hollowhorn Chime',category:'decor',description:'A resonant guardian keepsake.',outputItemId:'hollowhorn-chime',outputQuantity:1,materials:{rootpearl:3,wardenbark:2},relicShards:5,unlock:{kind:'discovery',id:'hollowhorn' satisfies WildSpecies},hint:'Complete the guardian encounter.'},
];

export const materialById=Object.fromEntries(materials.map(material=>[material.id,material]));
export const recipeById=Object.fromEntries(recipes.map(recipe=>[recipe.id,recipe]));
export const acquisitionMaterialFor=(species:WildSpecies)=>species==='mosskit'?'softmoss':species==='galecrest'||species==='veilfin'?'cloudglass':species==='cragback'||species==='emberstride'?'amberstone':species==='old-warden'?'wardenbark':species==='glintmoth'||species==='reedstalker'?'glassreed':species==='flintcap'?'saltbloom':'rootpearl';
