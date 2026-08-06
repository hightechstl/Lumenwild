import type {CreatureRarity, CreatureStats, WildSpecies} from '../types';

export type GlassrootSpecies='glintmoth'|'reedstalker'|'flintcap'|'prismhart'|'hollowhorn';
export interface GlassrootCreature {species:GlassrootSpecies;name:string;kind:string;rarity:CreatureRarity;goal:number;stats:CreatureStats;story:string;condition:string}
export const glassrootCreatures:GlassrootCreature[]=[
 {species:'glintmoth',name:'Glintmoth',kind:'Root-fox',rarity:'Uncommon',goal:2,stats:{tracking:80,agility:70,resolve:42},story:'Follow the tiny light-scratches beneath the root bridges.',condition:'Complete one prism-pool sifting contract.'},
 {species:'reedstalker',name:'Reedstalker',kind:'Rain listener',rarity:'Rare',goal:3,stats:{tracking:91,agility:62,resolve:58},story:'Answer its posture with patient, quiet route choices.',condition:'Befriend Glintmoth.'},
 {species:'flintcap',name:'Flintcap',kind:'Pool delver',rarity:'Rare',goal:3,stats:{tracking:55,agility:38,resolve:94},story:'Clear collapsed silt channels without disturbing its den.',condition:'Befriend Reedstalker.'},
 {species:'prismhart',name:'Prismhart',kind:'Squall walker',rarity:'Mythic',goal:4,stats:{tracking:84,agility:90,resolve:68},story:'Read four colors in the rain before the trail disappears.',condition:'Appears only during a prism squall after Flintcap joins.'},
 {species:'hollowhorn',name:'Hollowhorn',kind:'Basin guardian',rarity:'Legendary',goal:5,stats:{tracking:70,agility:45,resolve:100},story:'Restore the five root markers and stand through the guardian’s final call.',condition:'Befriend all four basin creatures.'},
];
export const glassrootSpecies=glassrootCreatures.map(entry=>entry.species) as WildSpecies[];
export const glassrootBySpecies=Object.fromEntries(glassrootCreatures.map(entry=>[entry.species,entry])) as Record<GlassrootSpecies,GlassrootCreature>;
