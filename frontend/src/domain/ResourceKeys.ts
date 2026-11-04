import type { CardAudioType, CardRarity, CardType } from "@/domain/Card";

type ResourceKey = string;
type StatisticIconKind = 'damage' | 'armor';
type SlotMarkKind = 'LEADER' | 'WARRIOR';

const KEY_SEPARATOR = '.';

/** Shown for a card whose image has not arrived, or does not exist (UI-21). */
const UNKNOWN_CARD_KEY: ResourceKey = 'card.unknown';

const HEALTH_ICON_KEY: ResourceKey = 'icon.health';

/** Number of attack audios of a combatant (CON-30). */
const ATTACK_AUDIO_VARIANTS = 3;

const joinKey = (...parts: string[]): ResourceKey => parts.join(KEY_SEPARATOR);

const cardImageKey = (type: CardType, code: string, rarity?: CardRarity): ResourceKey => {
  if (type !== 'WARRIOR') return joinKey(type.toLowerCase(), code);
  if (rarity === undefined) throw new Error('Card of type Warrior requires rarity as not null');

  return joinKey('warrior', rarity.toLowerCase(), code);
}

const cardFrameKey = (type: CardType, rarity?: CardRarity): ResourceKey => {
  if (type !== 'WARRIOR') return joinKey('frame', type.toLowerCase());
  if (rarity === undefined) throw new Error('Card of type Warrior requires rarity as not null');

  return joinKey('frame', rarity.toLowerCase());
}

const cardAudioKey = (imageKey: ResourceKey, action: CardAudioType, variant?: number): ResourceKey => {
  if (action !== 'attack' || variant === undefined) return joinKey(imageKey, action);

  return joinKey(imageKey, action, String(variant));
}

const statisticIconKey = (kind: StatisticIconKind, valueType: string): ResourceKey => joinKey('icon', kind, valueType.toLowerCase());

const slotMarkKey = (kind: SlotMarkKind): ResourceKey => joinKey('slot', kind.toLowerCase());

export type { ResourceKey, SlotMarkKind, StatisticIconKind };
export { ATTACK_AUDIO_VARIANTS, HEALTH_ICON_KEY, UNKNOWN_CARD_KEY, cardAudioKey, cardFrameKey, cardImageKey, slotMarkKey, statisticIconKey };
