# Cards

## Types

| Type | Description |
|---|---|
| Leader | One per player. If it dies, the player is eliminated. |
| Warrior | Protects the leader. Rarities: Common, Uncommon, Rare, Epic, Legendary, Mythic. For ethical reasons, the rarities that `docs/Requirements.md` calls Pop and Common are named Common and Uncommon: Pop == Common, Common == Uncommon. |
| Equipment | Attached to a Warrior or Leader to change its statistics. |
| Spell | **[Post-MVP]** See `SPELL` in `POST-MVP.md`. |

Leaders and warriors are the *combatants*: the cards that go on the board.

## Statistics

- **CARD-1** Warriors and Leaders have damage, armor and health.
- **CARD-2** A card has one damage type (Physical, Magic or True) and one armor type (Physical or Magic). True damage is **[Post-MVP]** (`COMBAT-8`): the type exists in the contract and its icon in `fixed` (`CON-30`), but no card of the base content has it (`CARD-5`).
- **CARD-3** Health is finite. **[Post-MVP]** Damage and health can be infinite.

## Base content

- **CARD-4** A card has a name, a description if it has one (leaders have none, `CARD-5`), a type, a rarity if it is a warrior, statistics and a texture. The client derives the manifest keys of the frame and image of a card from `type`, `rarity` and `catalogCode` (`CON-30`) and gets their URLs from the manifest, so `CardDto` has no texture field.
- **CARD-5** The base content of the MVP is the following. All damage and armor are physical.
- **CARD-6** A card in the deck can come with equipment already attached.
- **CARD-7** The name and description of a card travel as the keys `card.<type>.<code>.name` and `card.<type>.<code>.description`, for example `card.warrior.0.name`, where `<type>` is the lowercase `type` and `<code>` is the one in `catalogCode` (`CON-26`), and the client translates them. The tables below give their text in Spanish.

### Leaders

| Code | Name | Damage | Armor | Health |
|---|---|---|---|---|
| 0 | 0 | 10 | 0 | 100 |
| 1 | 1 | 10 | 0 | 100 |

The name of a leader is its code, and leaders have no description, so their `CardDto` carries no `description` (`CON-8`). **[Post-MVP]** Leaders have their own names and descriptions.

### Warriors

| Code | Name | Rarity | Damage | Armor | Health | Description |
|---|---|---|---|---|---|---|
| 0 | Hugo | Common | 5 | 0 | 5 | Un Humano |
| 1 | Perro | Uncommon | 10 | 0 | 10 | Un animal fiero y fiel |
| 2 | Policía | Uncommon | 5 | 0 | 10 | Un Humano que se encarga de mantener el orden |
| 3 | Jose | Common | 5 | 0 | 15 | Un Humano |
| 4 | Zombie | Rare | 10 | 5 | 10 | Un muerto viviente |
| 5 | Alien | Epic | 5 | 0 | 15 | Un extraterrestre que ha venido a visitarnos desde otro planeta. |
| 6 | Argoth | Legendary | 5 | 0 | 15 | Argoth es un guerrero imponente, conocido en todo el reino por su estatura colosal y su armadura forjada en el fuego de las montañas sagradas. Su armadura negra reluce con inscripciones antiguas, cargadas de poder ancestral. En su pecho lleva grabado el símbolo de un trueno, un recordatorio de su vínculo con las fuerzas de la naturaleza. |
| 7 | Odin | Mythic | 5 | 0 | 15 | Un dios de la mitología nórdica |

Policía comes with Pistolón attached. Argoth and Odin are not dealt, because the schedule in `ROUND-4` has no Legendary or Mythic slot.

### Equipment

| Code | Name | Effect | Description |
|---|---|---|---|
| 0 | Pistolón | +15 damage | Arma a distancia |
| 1 | Espada | +5 damage | Arma a cuerpo a cuerpo |
| 2 | Armadura de hierro | +5 armor | Armadura de calidad media |

## Equipment

- **EQUIP-1** Basic equipment adds or subtracts fixed values of damage, armor or health. A value has no type of its own: it takes the damage or armor type of the card, also when the card had 0 of it. Equipment with abilities is **[Post-MVP]**.
- **EQUIP-2** Equipping is an action of the player's turn. It has no cooldown and does not use the card's attack.
- **EQUIP-3** Equipment can only be attached to the player's own cards on the board, including the leader, protected cards and cards in cooldown. **[Post-MVP]** It can also be attached to enemy cards.
- **EQUIP-4** A card can hold any number of pieces of equipment, and their effects add up.
- **EQUIP-5** Damage, armor and maximum armor (`EQUIP-6`) do not drop below 0, and current and maximum health do not drop below 1 because of equipment. These limits apply to the total of all the pieces, not piece by piece. Equipment never kills a card.
- **EQUIP-6** Equipment changes the maximum armor and health and keeps what the card has already lost: current health is the new maximum minus the health lost, so a health bonus raises both current and maximum health and a penalty lowers both. When `EQUIP-5` stops current health at 1, the health it saved no longer counts as lost. Armor works the same way, with two differences: a card has no maximum armor of its own, so its maximum is the armor it has when it receives its first piece plus the pieces, and `CardDto` does not carry it; and when `EQUIP-5` stops armor at 0, the armor it saved no longer counts as lost.
- **EQUIP-7** **[Post-MVP]** When a living card loses equipment, its values are removed with the model of `EQUIP-6`: the maximums change, what the card has already lost is kept, and the limits of `EQUIP-5` apply, so losing equipment never kills. For example, a card with 6 of 10 health that has lost 4 and loses a piece of +5 health is left with 1 of 5.
- **EQUIP-8** The equipment disappears when the card dies. **[Post-MVP]** It also disappears when the card permanently changes owner.

### Scenarios

**Penalty cannot kill**
- Given a warrior with 2 health
- When its owner attaches equipment with -5 health
- Then the warrior has 1 health and is alive

**Penalty on a damaged card, then a bonus**
- Given a warrior with 2 of 10 health
- When its owner attaches equipment with -5 health and then equipment with +5 health
- Then the warrior has 1 of 5 health after the first, and 6 of 10 after the second

**Armor penalty, then a bonus**
- Given a warrior with 2 armor and no equipment
- When its owner attaches equipment with -5 armor and then equipment with +5 armor
- Then the warrior has 0 armor after the first, and 2 after the second

**Armor lost before the first piece**
- Given a warrior with 10 armor that lost 4 of it in an attack
- When its owner attaches equipment with +5 armor
- Then the warrior has 11 armor

**Limits apply to the total**
- Given a warrior with 3 damage
- When its owner attaches equipment with -5 damage and then equipment with +4 damage
- Then the warrior has 2 damage

**Armor on a card without armor**
- Given a warrior with 0 armor and magic armor type
- When its owner attaches equipment with +5 armor
- Then the warrior has 5 magic armor

**Rejected on an enemy**
- Given an enemy warrior on the board
- When a player attaches equipment to it
- Then the action is rejected and the equipment stays in the hand
