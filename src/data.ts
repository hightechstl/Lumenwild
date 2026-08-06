import type { Item, Species } from './types';
export const starters:{id:Species;name:string;temperament:string;gift:string}[]=[
 {id:'spriggle',name:'Spriggle',temperament:'Alert & curious',gift:'Finds extra forage'},
 {id:'mallowisp',name:'Mallowisp',temperament:'Calm & observant',gift:'Recovers energy quickly'},
 {id:'bramblet',name:'Bramblet',temperament:'Bold & loyal',gift:'Earns exploration bonuses'}];
export const seedItems:Item[]=[
 {id:'tart',name:'Mossberry Tart',category:'food',icon:'🫐',price:35,description:'Sweet woodland berries restore hunger.',quantity:0},
 {id:'bell',name:'Tumblebell',category:'toy',icon:'🔔',price:55,description:'A chiming toy that lifts the mood.',quantity:0},
 {id:'primer',name:'Moonleaf Primer',category:'book',icon:'📗',price:45,description:'Field notes for curious creatures.',quantity:0},
 {id:'beret',name:'Acorn Beret',category:'wearable',icon:'🌰',price:90,description:'A jaunty cap, stitched from fallen leaves.',quantity:0},
 {id:'lamp',name:'Firefly Lantern',category:'decor',icon:'🏮',price:120,description:'A warm light for the coziest nook.',quantity:0},
 {id:'tea',name:'Sunpetal Tea',category:'food',icon:'🍵',price:28,description:'A mellow restorative brew.',quantity:0},
 {id:'trail-kit',name:'Mossmere Trail Kit',category:'supply',icon:'🎒',price:0,description:'A crafted field kit that restores companion Energy.',quantity:0},
 {id:'brightroot-tonic',name:'Brightroot Tonic',category:'restorative',icon:'🧪',price:0,description:'A warming tonic for Energy and Health.',quantity:0},
 {id:'mossberry-offering',name:'Mossberry Offering',category:'offering',icon:'🫐',price:0,description:'A patient gesture welcomed by shy woodland creatures.',quantity:0},
 {id:'reedweave-cushion',name:'Reedweave Cushion',category:'furniture',icon:'🧶',price:0,description:'Cloudfen reeds woven into a soft nook cushion.',quantity:0},
 {id:'wayfinder-mantle',name:'Wayfinder Mantle',category:'wearable',icon:'🧣',price:0,description:'A weatherwise mantle stitched for long expeditions.',quantity:0},
 {id:'warden-compass',name:'Warden Compass',category:'supply',icon:'🧭',price:0,description:'A shard-tuned compass for the oldest trails.',quantity:0},
 {id:'basin-salve',name:'Basin Salve',category:'restorative',icon:'🫙',price:70,description:'A cooling Glassroot remedy that restores expedition Energy.',quantity:0},
 {id:'rootglass-stool',name:'Rootglass Stool',category:'furniture',icon:'🪑',price:0,description:'A translucent-root seat crafted in Glassroot Basin.',quantity:0},
 {id:'prism-cloak',name:'Prism-Rain Cloak',category:'wearable',icon:'🌈',price:0,description:'A weatherproof mantle that catches the colors of a prism squall.',quantity:0},
 {id:'hollowhorn-chime',name:'Hollowhorn Chime',category:'decor',icon:'🎐',price:0,description:'A guardian keepsake that hums before basin storms.',quantity:0}];

export const shops=[{name:'The Forage Fold',keeper:'Mira Thistledown',line:'Freshly gathered, fairly traded.',items:['tart','tea','primer']},{name:'Nook & Notion',keeper:'Orrin Wren',line:'Little wonders for lived-in rooms.',items:['bell','beret','lamp']}];
