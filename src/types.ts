export type NeedKey='hunger'|'mood'|'energy'|'health'|'bond';
export type Species='spriggle'|'mallowisp'|'bramblet';
export type WildSpecies='mosskit'|'galecrest'|'cragback'|'emberstride'|'veilfin'|'old-warden'|'glintmoth'|'reedstalker'|'flintcap'|'prismhart'|'hollowhorn';
export type CreatureSpecies=Species|WildSpecies;
export type CreatureRarity='Common'|'Uncommon'|'Rare'|'Mythic'|'Legendary';
export interface CreatureStats {tracking:number;agility:number;resolve:number}
export interface OwnedCreature {id:string;species:CreatureSpecies;name:string;rarity:CreatureRarity;bond:number;origin:string;stats:CreatureStats;energy:number;maxEnergy:number;energyUpdatedAt:number;abilityUsedDate:string;personalQuestClaimed:boolean;unlockedMilestones:string[]}
export type ItemCategory='food'|'toy'|'book'|'wearable'|'decor'|'supply'|'offering'|'restorative'|'furniture';
export interface Item {id:string;name:string;category:ItemCategory;icon:string;price:number;description:string;quantity:number}
export type QuestKind='daily'|'weekly'|'regional'|'story';
export type QuestEvent='care'|'feed'|'groom'|'train'|'study'|'forage'|'gather'|'craft'|'purchase'|'marksSpent'|'marksEarned'|'encounter'|'encounterSuccess';
export interface QuestReward {marks?:number;relicShards?:number;items?:Partial<Record<string,number>>;materials?:Partial<Record<string,number>>;cosmetic?:string}
export interface QuestRecord {progress:number;completedAt?:number;claimedAt?:number}
export interface GameState {saveRevision:number;recentActions:string[];player:string;creatureName:string;species:Species;needs:Record<NeedKey,number>;dewdrops:number;starpetals:number;inventory:Item[];materials:Record<string,number>;discoveredMaterials:string[];discoveredRecipes:string[];cosmetics:string[];questRecords:Record<string,QuestRecord>;questHistory:string[];equipped:string[];roomTheme:string;dailyCare:number;dailyCareDate:string;claimed:boolean;achievements:string[];lastAction:string;creatures:OwnedCreature[];activeCreatureId:string;discoveries:WildSpecies[];encounterProgress:Partial<Record<WildSpecies,number>>;encounterDays:Partial<Record<WildSpecies,string[]>>;encounterRotationDate:string;encounterRotation:WildSpecies[];encounterAttemptDate:string;dailyEncounterAttempts:Partial<Record<WildSpecies,number>>;fieldDays:string[];forageDate:string;foragePlays:number;glassrootStoryStep:number;glassrootGatherDate:string;glassrootGatherPlays:number;glassrootWeatherDate:string;glassrootWeather:'clear'|'mist'|'prism-squall'}
