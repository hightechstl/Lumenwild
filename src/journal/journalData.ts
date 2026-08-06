import type {CreatureRarity,WildSpecies} from '../types';

export interface SpeciesEntry {id:WildSpecies;name:string;habitat:string;temperament:string;rarity:CreatureRarity;art:string;lore:string}
export const speciesEntries:SpeciesEntry[]=[
 {id:'mosskit',name:'Mosskit',habitat:'Mossmere root hollows',temperament:'Shy and resourceful',rarity:'Uncommon',art:'creature-mosskit.png',lore:'Its whiskers find hollow roots, and its trust is shown through shared caches.'},
 {id:'galecrest',name:'Galecrest',habitat:'Cloudfen upper currents',temperament:'Restless and perceptive',rarity:'Rare',art:'creature-galecrest.png',lore:'Long feathers hum before a storm and reveal safe air to patient scouts.'},
 {id:'cragback',name:'Cragback',habitat:'Amber Reach stone paths',temperament:'Steady and protective',rarity:'Rare',art:'creature-cragback.png',lore:'Each armored ridge remembers a migration across the sun-warmed Reach.'},
 {id:'emberstride',name:'Emberstride',habitat:'Amber Reach burning ridges',temperament:'Bold and competitive',rarity:'Mythic',art:'creature-emberstride.png',lore:'Warm footprints linger in cold stone after it races an approaching storm.'},
 {id:'veilfin',name:'Veilfin',habitat:'Cloudfen silent currents',temperament:'Elusive and observant',rarity:'Mythic',art:'creature-veilfin.png',lore:'Its fins mirror constellations hidden above the clouds.'},
 {id:'old-warden',name:'Old Warden',habitat:'The Bramblewake Ruins',temperament:'Ancient and resolute',rarity:'Legendary',art:'creature-old-warden.png',lore:'It carries fragments of vanished roads and remembers every restored marker.'},
 {id:'glintmoth',name:'Glintmoth',habitat:'Glassroot luminous pools',temperament:'Curious and quick',rarity:'Uncommon',art:'creature-glintmoth.png',lore:'Its bright ears hear light striking crystal beneath the roots.'},
 {id:'reedstalker',name:'Reedstalker',habitat:'Glassroot rain channels',temperament:'Patient and wary',rarity:'Rare',art:'creature-reedstalker.png',lore:'Stillness is its greeting; each reed-like leg answers a different current.'},
 {id:'flintcap',name:'Flintcap',habitat:'Glassroot flooded hollows',temperament:'Rugged and methodical',rarity:'Rare',art:'creature-flintcap.png',lore:'It builds dry chambers below flooded ground and guards their springs.'},
 {id:'prismhart',name:'Prismhart',habitat:'Glassroot prism squalls',temperament:'Elegant and independent',rarity:'Mythic',art:'creature-prismhart.png',lore:'No two colors cast by its antlers ever follow the same path.'},
 {id:'hollowhorn',name:'Hollowhorn',habitat:'Glassroot deep rootways',temperament:'Formidable and watchful',rarity:'Legendary',art:'creature-hollowhorn.png',lore:'Its rootsong carries through the basin only when an old path is restored.'},
];

export const regions=[
 {id:'mossmere',name:'Mossmere',description:'Forage contracts and Mosskit trust',complete:(s:any)=>s.creatures.some((c:any)=>c.species==='mosskit')},
 {id:'cloudfen',name:'Cloudfen',description:'Galecrest and Veilfin sky routes',complete:(s:any)=>s.creatures.some((c:any)=>c.species==='galecrest')&&s.creatures.some((c:any)=>c.species==='veilfin')},
 {id:'amber',name:'Amber Reach',description:'Cragback and Emberstride ridge trails',complete:(s:any)=>s.creatures.some((c:any)=>c.species==='cragback')&&s.creatures.some((c:any)=>c.species==='emberstride')},
 {id:'ruins',name:'The Ruins',description:'The Old Warden’s restored road',complete:(s:any)=>s.creatures.some((c:any)=>c.species==='old-warden')},
 {id:'glassroot',name:'Glassroot Basin',description:'Five basin creatures and guardian story',complete:(s:any)=>s.glassrootStoryStep>=6&&['glintmoth','reedstalker','flintcap','prismhart','hollowhorn'].every(id=>s.creatures.some((c:any)=>c.species===id))},
] as const;
