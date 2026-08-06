import { useState } from 'react';
import { Coins } from 'lucide-react';
import { shops } from './data';
import { buy } from './game';
import type { GameState } from './types';

const itemCells: Record<string, [number, number]> = {
  tart: [0, 0], bell: [1, 0], primer: [2, 0],
  beret: [0, 1], lamp: [1, 1], tea: [2, 1],
};
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

function ItemArt({ id }: { id: string }) {
  const cell = itemCells[id] ?? [0, 0];
  return <span className="item-art" style={{ backgroundImage: `url(${asset('items.png')})`, backgroundPosition: `${cell[0] * 50}% ${cell[1] * 100}%` }} aria-hidden="true" />;
}

export function Shop({ state, act }: { state: GameState; act: (state: GameState) => void }) {
  const [selectedVendor, setSelectedVendor] = useState(0);
  const vendor = shops[selectedVendor];
  return <section className="page shop-page">
    <header className="illustrated-page-header market-header"><p>Bramblewake trading post</p><h1>Shop</h1><span>Spend earned Marks on expedition supplies, equipment, and comforts for your nook.</span></header>
    <div className="shops">
      <div className="shop-tabs">{shops.map((entry, index) => <button className={index === selectedVendor ? 'active' : ''} onClick={() => setSelectedVendor(index)} key={entry.name}>{entry.name}</button>)}</div>
      <h2>{vendor.name}</h2><p><b>{vendor.keeper}</b> · “{vendor.line}”</p>
      <div className="wares">{vendor.items.map(id => { const item = state.inventory.find(entry => entry.id === id)!; return <article key={id}><ItemArt id={id} /><h3>{item.name}</h3><p>{item.description}</p><button onClick={() => act(buy(state, id))}><Coins /> {item.price}</button></article>; })}</div>
    </div>
  </section>;
}
