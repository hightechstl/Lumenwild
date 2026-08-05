# Product brief

Lumenwild is a gentle adventure and creature-care game for a broad audience: children playing with family, teens, adults, and older players. It avoids gender-coded language, cosmetics, and marketing. The core fantasy is discovering a small living light in a vast floating wilderness and building a meaningful daily bond through care, exploration, collecting, and personal expression.

The differentiators are its field-journal visual language, calm but purposeful play sessions, transparent economy, and a world that treats care as exploration rather than obligation. The repeatable loop is: check in, respond to a Glimmer’s needs, choose an activity, earn Dewdrops, find or purchase an object, personalize the Glimmer or nook, advance a collection or daily glow, and leave with a reason to return.

## Directions considered

1. **Lumenwild — adventurous field journal.** Glimmers awaken from seeds of starlight across the Bramblewake archipelago. Botanical paper-cut art, plum ink, moss, coral, teal, and gold.
2. **Hushgrove — twilight naturalist club.** Soft nocturnal creatures gather around a traveling observatory; indigo, clay, fern, and lantern amber.
3. **Kindredrift — skyfaring keepsakes.** Curious beings migrate between wind-carved islands; airy maps, woven textiles, sky blue, rust, and lichen.

Lumenwild was selected for its memorable vocabulary, inclusive adventure-care balance, and ability to appeal across ages without becoming juvenile or austere.

## Initial world and economy

- Creatures are **Glimmers**. Starters: curious Spriggle, gentle Mallowisp, bold Bramblet. Traits affect flavor and modest exploration bonuses, never competitive power.
- Starter region: **Mossmere**, one island in the **Bramblewake Archipelago**.
- Shops: **The Forage Fold** with Mira Thistledown, and **Nook & Notion** with Orrin Wren.
- Categories: food, toys, books, wearables, and nook decor.
- **Dewdrops** are earned from care goals, validated games, quests, achievements, exploration, and selling. Configurable daily earning caps apply.
- **Starpetals** are optional and cosmetic-only. They cannot buy health, need restoration, progression, competitive strength, inventory capacity, or basic convenience.
- No loot boxes, gambling, crypto, real-money trading, or pay-to-win systems.

## Phased plan

- MVP: local onboarding, three starters, care dashboard, needs, inventory/equipment, one nook, Mossmere, two shops, daily glow, Skyhop, profile, achievements, responsive UI, save persistence, economy-rule tests.
- Production foundation: OIDC authentication, PostgreSQL schema/migrations, server-authoritative domain service, append-only ledger, idempotency keys, rate limits, score attestation/replay validation, structured privacy-safe logs.
- Expansion: more regions/Glimmers, crafting/gardening, expanded habitats, PvE, moderated controlled social actions and cooperative events.
- Community: balanced PvP, player markets/trades, Circles, seasonal collaboration, moderated creative programs, native apps.

## Security model for production

Accounts own creatures and inventory rows through foreign keys and row-level authorization. Every balance change is a signed server transaction with a unique idempotency key and reason code. Balances are derived or reconciled from an append-only ledger. Reward claims use server time and unique `(account, reward, period)` constraints. Purchases lock the account balance row inside a database transaction. Minigame sessions receive a nonce and deterministic seed; the server validates duration, inputs, score ceiling, nonce reuse, and configurable daily caps. Client state is a view, never authority.
