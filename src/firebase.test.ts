import {describe,expect,it} from 'vitest';
import {CURRENT_SCHEMA_VERSION,migrateGameState} from './firebase';
import {initialState} from './game';

describe('Firebase save migrations',()=>{
  it('preserves economy, inventory, and identity while adding concurrency metadata',()=>{const old={...initialState(),player:'Returning Wanderer',dewdrops:777,saveRevision:undefined,recentActions:undefined} as unknown as ReturnType<typeof initialState>;const migrated=migrateGameState(old);expect(migrated.player).toBe('Returning Wanderer');expect(migrated.dewdrops).toBe(777);expect(migrated.saveRevision).toBe(0);expect(migrated.recentActions).toEqual([]);expect(CURRENT_SCHEMA_VERSION).toBe(8)});
  it('normalizes renamed achievements without duplicating them',()=>{const migrated=migrateGameState({...initialState(),achievements:['First Light','First Companion','A Little Brighter']});expect(migrated.achievements).toEqual(['First Companion','Field Routine'])});
  it('retains only the latest action receipts',()=>{const recentActions=Array.from({length:40},(_,i)=>`action-${i}`);expect(migrateGameState({...initialState(),recentActions}).recentActions).toEqual(recentActions.slice(-30))});
});
