import type {CreatureStats,WildSpecies} from '../types';

export type EncounterTemplate='timing'|'observation'|'route';
export interface EncounterProfile {species:WildSpecies;name:string;region:string;template:EncounterTemplate;attribute:keyof CreatureStats;difficulty:number;intro:string;action:string}

export const encounterProfiles:Record<WildSpecies,EncounterProfile>={
 mosskit:{species:'mosskit',name:'Mosskit',region:'Mossmere',template:'observation',attribute:'tracking',difficulty:48,intro:'Compare the ground signs and identify the freshest trail.',action:'Read the signs'},
 galecrest:{species:'galecrest',name:'Galecrest',region:'Cloudfen',template:'timing',attribute:'agility',difficulty:68,intro:'Mark the calm instant between two crossing gusts.',action:'Mark the wind'},
 cragback:{species:'cragback',name:'Cragback',region:'Amber Reach',template:'route',attribute:'resolve',difficulty:78,intro:'Choose a steady approach that gives the herd room to move.',action:'Choose the route'},
 emberstride:{species:'emberstride',name:'Emberstride',region:'Amber Reach',template:'timing',attribute:'agility',difficulty:82,intro:'Match the ridge runner’s pace without crowding its path.',action:'Match the stride'},
 veilfin:{species:'veilfin',name:'Veilfin',region:'Cloudfen',template:'observation',attribute:'tracking',difficulty:86,intro:'Interpret the faint ripples left in the upper cloud current.',action:'Read the current'},
 'old-warden':{species:'old-warden',name:'Old Warden',region:'The Ruins',template:'route',attribute:'resolve',difficulty:92,intro:'Select the respectful path through the guardian stones.',action:'Enter the ruins'},
 glintmoth:{species:'glintmoth',name:'Glintmoth',region:'Glassroot Basin',template:'observation',attribute:'tracking',difficulty:66,intro:'Trace the newest glints beneath the roots.',action:'Follow the light'},
 reedstalker:{species:'reedstalker',name:'Reedstalker',region:'Glassroot Basin',template:'route',attribute:'tracking',difficulty:74,intro:'Match its careful posture through the pools.',action:'Read the posture'},
 flintcap:{species:'flintcap',name:'Flintcap',region:'Glassroot Basin',template:'route',attribute:'resolve',difficulty:80,intro:'Choose a stable channel through shifting silt.',action:'Clear the channel'},
 prismhart:{species:'prismhart',name:'Prismhart',region:'Glassroot Basin',template:'timing',attribute:'agility',difficulty:88,intro:'Mark the instant four colors cross.',action:'Read the squall'},
 hollowhorn:{species:'hollowhorn',name:'Hollowhorn',region:'Glassroot Basin',template:'route',attribute:'resolve',difficulty:96,intro:'Restore the root markers before the guardian calls.',action:'Answer the guardian'},
};

export interface ChoiceRound {prompt:string;choices:string[];correct:number;guidance:string}
const observationRounds:Record<'mosskit'|'veilfin',ChoiceRound[]>={
 mosskit:[
  {prompt:'Which sign was made most recently?',choices:['Dry leaves beneath an old print','Bent moss still holding dew','A weathered scratch on bark'],correct:1,guidance:'Fresh pressure leaves moisture gathered at the edges.'},
  {prompt:'Where did the Mosskit pause?',choices:['Beside opened berry husks','On the bare stone shelf','Under an untouched fern'],correct:0,guidance:'The scattered husks still carry woodland scent.'},
  {prompt:'Which way did the trail turn?',choices:['Toward snapped reeds','Across undisturbed lichen','Into a still spiderweb'],correct:0,guidance:'Broken stems lean in the direction of travel.'},
 ],
 veilfin:[
  {prompt:'Which current holds a recent wake?',choices:['A smooth silver band','A spiral with bright motes','A cloudbank with settled dust'],correct:1,guidance:'Suspended motes continue turning after a Veilfin passes.'},
  {prompt:'Where will it surface next?',choices:['Downwind of the paired ripples','Inside the motionless fog','Below the falling amber dust'],correct:0,guidance:'Paired ripples open toward the next surface point.'},
  {prompt:'Which mark belongs to a Veilfin?',choices:['Three sharp claw lines','A broad drifting crescent','Heavy stones pushed aside'],correct:1,guidance:'Its fins leave wide crescents rather than hard edges.'},
 ],
};
const routeRounds:Record<'cragback'|'old-warden',ChoiceRound[]>={
 cragback:[
  {prompt:'A young Cragback blocks the narrow shelf.',choices:['Rush past before it turns','Wait beside the wide cairn','Climb above the herd'],correct:1,guidance:'Space and patience show steadiness without threatening the herd.'},
  {prompt:'Loose stone begins sliding underfoot.',choices:['Hold position on the rooted ledge','Leap toward the nearest animal','Shout to scatter the herd'],correct:0,guidance:'A rooted ledge protects both traveler and herd.'},
  {prompt:'The herd turns to face the trail.',choices:['Lower your stance and pause','Wave both arms overhead','Move directly toward the leader'],correct:0,guidance:'A low, still posture lets the herd choose the distance.'},
 ],
 'old-warden':[
  {prompt:'Three archways wake beneath the ruins.',choices:['The arch with fresh-cut vines','The arch aligned with old lanterns','The arch marked by broken stone'],correct:1,guidance:'The Warden’s route follows lights maintained across generations.'},
  {prompt:'A guardian bell sounds once.',choices:['Answer with one quiet chime','Run through before it sounds again','Strike every bell nearby'],correct:0,guidance:'A measured answer acknowledges the guardian without challenging it.'},
  {prompt:'The final stones begin to glow.',choices:['Step only on the steady lights','Follow the fastest flicker','Cross the unlit center'],correct:0,guidance:'Steady lights mark stones that accept a traveler’s weight.'},
 ],
};

export function encounterRound(species:WildSpecies,round:number):ChoiceRound|null{
 if(species==='mosskit'||species==='veilfin'){const choices=observationRounds[species];return choices[round%choices.length]}
 if(species==='cragback'||species==='old-warden'){const choices=routeRounds[species];return choices[round%choices.length]}
 return null;
}

export const assistanceLevel=(score:number,difficulty:number)=>score>=difficulty+8?'strong':score>=difficulty-8?'matched':'challenging';
