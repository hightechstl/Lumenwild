export interface SeedDefinition {id:string;name:string;icon:string;region:string;growMs:number;description:string;reward:{material?:string;quantity:number;marks?:number}}
export const seeds:SeedDefinition[]=[
 {id:'mossberry',name:'Mossberry',icon:'🫐',region:'Mossmere',growMs:30*60_000,description:'A forgiving trail berry used in offerings.',reward:{material:'softmoss',quantity:2}},
 {id:'sunpetal',name:'Sunpetal',icon:'🌻',region:'Mossmere',growMs:60*60_000,description:'Warm petals valued by cooks and companions.',reward:{quantity:1,marks:55}},
 {id:'cloudreed',name:'Cloud Reed',icon:'🌾',region:'Cloudfen',growMs:2*60*60_000,description:'A light reed that gathers mist in its stem.',reward:{material:'cloudglass',quantity:2}},
 {id:'amberroot',name:'Amberroot',icon:'🥕',region:'Amber Reach',growMs:3*60*60_000,description:'A rugged root that thrives in warm stone.',reward:{material:'amberstone',quantity:2}},
 {id:'glassbloom',name:'Glassbloom',icon:'🪻',region:'Glassroot Basin',growMs:4*60*60_000,description:'A basin flower that refracts gentle rain.',reward:{material:'glassreed',quantity:3}},
 {id:'pearlfern',name:'Pearl Fern',icon:'🌿',region:'Glassroot Basin',growMs:6*60*60_000,description:'A rare fern grown from a Root Pearl cutting.',reward:{material:'rootpearl',quantity:1}},
];
export const seedById=Object.fromEntries(seeds.map(seed=>[seed.id,seed]));
