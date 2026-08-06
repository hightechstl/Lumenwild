import type {QuestEvent,QuestKind,QuestReward} from '../types';

export interface QuestDefinition {
  id:string;
  kind:QuestKind;
  title:string;
  description:string;
  metric:QuestEvent;
  target:number;
  reward:QuestReward;
  prerequisite?:string;
  region?:string;
  chapter?:number;
}

export const dailyQuestPool:QuestDefinition[]=[
  {id:'daily-care',kind:'daily',title:'Companion Check-in',description:'Complete three care actions.',metric:'care',target:3,reward:{marks:70}},
  {id:'daily-forage',kind:'daily',title:'Mossmere Contract',description:'Complete one Forage Run.',metric:'forage',target:1,reward:{marks:55,materials:{mossfiber:1}}},
  {id:'daily-shop',kind:'daily',title:'Prepared Pack',description:'Purchase one useful item.',metric:'purchase',target:1,reward:{marks:40,relicShards:1}},
  {id:'daily-trail',kind:'daily',title:'Fresh Field Notes',description:'Complete one successful encounter survey.',metric:'encounterSuccess',target:1,reward:{marks:80}},
  {id:'daily-feed',kind:'daily',title:'Trail Rations',description:'Feed your active companion twice.',metric:'feed',target:2,reward:{marks:60}},
  {id:'daily-train',kind:'daily',title:'Steady Footing',description:'Train with your companion twice.',metric:'train',target:2,reward:{marks:65}},
  {id:'daily-study',kind:'daily',title:'Quiet Observation',description:'Study with your companion twice.',metric:'study',target:2,reward:{relicShards:2}},
  {id:'daily-groom',kind:'daily',title:'Field Ready',description:'Groom your companion twice.',metric:'groom',target:2,reward:{marks:50,materials:{softmoss:1}}},
];

export const weeklyQuestPool:QuestDefinition[]=[
  {id:'weekly-care',kind:'weekly',title:'Trusted Routine',description:'Complete twelve care actions this week.',metric:'care',target:12,reward:{marks:220,relicShards:2}},
  {id:'weekly-forage',kind:'weekly',title:'Mossmere Provisioner',description:'Complete five Forage Runs this week.',metric:'forage',target:5,reward:{marks:240,materials:{mossfiber:4}}},
  {id:'weekly-trails',kind:'weekly',title:'Patient Naturalist',description:'Record three successful encounter surveys.',metric:'encounterSuccess',target:3,reward:{relicShards:5,materials:{cloudglass:1}}},
  {id:'weekly-market',kind:'weekly',title:'Thoughtful Outfitting',description:'Spend 150 Marks at regional vendors.',metric:'marksSpent',target:150,reward:{marks:75,cosmetic:'Field Board Pennant'}},
  {id:'weekly-earn',kind:'weekly',title:'Working the Wilds',description:'Earn 300 Marks through play.',metric:'marksEarned',target:300,reward:{relicShards:4,items:{tea:2}}},
];

export const regionalQuests:QuestDefinition[]=[
  {id:'regional-mossmere-1',kind:'regional',region:'Mossmere',title:'Survey the Reedpaths',description:'Complete three Mossmere Forage Runs.',metric:'forage',target:3,reward:{materials:{mossfiber:3},marks:120}},
  {id:'regional-mossmere-2',kind:'regional',region:'Mossmere',title:'Signs Beneath the Ferns',description:'Complete two successful creature surveys.',metric:'encounterSuccess',target:2,prerequisite:'regional-mossmere-1',reward:{relicShards:3,items:{tart:1}}},
  {id:'regional-cloudfen-1',kind:'regional',region:'Cloudfen',title:'A Current Worth Following',description:'Complete three successful creature surveys.',metric:'encounterSuccess',target:3,prerequisite:'regional-mossmere-2',reward:{materials:{cloudglass:2},marks:180}},
];

export const storyQuests:QuestDefinition[]=[
  {id:'story-1',kind:'story',chapter:1,title:'The Board Awakens',description:'Complete three care actions to prepare your first expedition entry.',metric:'care',target:3,reward:{marks:100,cosmetic:'Pressed Fern Page'}},
  {id:'story-2',kind:'story',chapter:2,title:'Ink from the Mossmere',description:'Complete two Forage Runs for the board keeper.',metric:'forage',target:2,prerequisite:'story-1',reward:{materials:{mossfiber:2},relicShards:2}},
  {id:'story-3',kind:'story',chapter:3,title:'A Trail Between Islands',description:'Complete one successful encounter survey.',metric:'encounterSuccess',target:1,prerequisite:'story-2',reward:{marks:200,items:{primer:1},cosmetic:'Trailkeeper Ribbon'}},
];
