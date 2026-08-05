export type NeedKey='hunger'|'mood'|'energy'|'health'|'bond';
export type Species='spriggle'|'mallowisp'|'bramblet';
export type ItemCategory='food'|'toy'|'book'|'wearable'|'decor';
export interface Item {id:string;name:string;category:ItemCategory;icon:string;price:number;description:string;quantity:number}
export interface GameState {player:string;creatureName:string;species:Species;needs:Record<NeedKey,number>;dewdrops:number;starpetals:number;inventory:Item[];equipped:string[];roomTheme:string;dailyCare:number;claimed:boolean;achievements:string[];lastAction:string}
