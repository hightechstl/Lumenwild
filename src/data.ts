import type { Item, Species } from './types';
export const starters:{id:Species;name:string;temperament:string;gift:string}[]=[
 {id:'spriggle',name:'Spriggle',temperament:'Bright & curious',gift:'Finds extra forage'},
 {id:'mallowisp',name:'Mallowisp',temperament:'Gentle & dreamy',gift:'Recovers energy quickly'},
 {id:'bramblet',name:'Bramblet',temperament:'Bold & loyal',gift:'Earns exploration bonuses'}];
export const seedItems:Item[]=[
 {id:'tart',name:'Mossberry Tart',category:'food',icon:'🫐',price:35,description:'Sweet woodland berries restore hunger.',quantity:3},
 {id:'bell',name:'Tumblebell',category:'toy',icon:'🔔',price:55,description:'A chiming toy that lifts the mood.',quantity:1},
 {id:'primer',name:'Moonleaf Primer',category:'book',icon:'📗',price:45,description:'Quiet stories for curious Glimmers.',quantity:1},
 {id:'beret',name:'Acorn Beret',category:'wearable',icon:'🌰',price:90,description:'A jaunty cap, stitched from fallen leaves.',quantity:1},
 {id:'lamp',name:'Firefly Lantern',category:'decor',icon:'🏮',price:120,description:'A warm light for the coziest nook.',quantity:0},
 {id:'tea',name:'Sunpetal Tea',category:'food',icon:'🍵',price:28,description:'A mellow restorative brew.',quantity:0}];
export const shops=[{name:'The Forage Fold',keeper:'Mira Thistledown',line:'Freshly gathered, fairly traded.',items:['tart','tea','primer']},{name:'Nook & Notion',keeper:'Orrin Wren',line:'Little wonders for lived-in rooms.',items:['bell','beret','lamp']}];
