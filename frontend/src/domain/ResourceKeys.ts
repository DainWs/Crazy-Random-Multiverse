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

const cardImageKey = (type: CardType, code: string, rarity?: CardRarity): ResourceKey => {
  if (type !== 'WARRIOR') {
    return joinKey(type.toLowerCase(), code);
  }

  return joinKey('warrior', requireRarity(rarity).toLowerCase(), code);
};

const cardFrameKey = (type: CardType, rarity?: CardRarity): ResourceKey => {
  if (type !== 'WARRIOR') {
    return joinKey('frame', type.toLowerCase());
  }

  return joinKey('frame', requireRarity(rarity).toLowerCase());
};

const cardAudioKey = (imageKey: ResourceKey, action: CardAudioType, variant?: number): ResourceKey => {
  if (action !== 'attack' || variant === undefined) {
    return joinKey(imageKey, action);
  }

  return joinKey(imageKey, action, String(variant));
};

const statisticIconKey = (kind: StatisticIconKind, valueType: string): ResourceKey => {
  return joinKey('icon', kind, valueType.toLowerCase());
};

const slotMarkKey = (kind: SlotMarkKind): ResourceKey => {
  return joinKey('slot', kind.toLowerCase());
};

function requireRarity(rarity?: CardRarity): CardRarity {
  if (rarity === undefined) {
    throw new Error('Card of type Warrior requires rarity as not null');
  }

  return rarity;
}

function joinKey(...parts: string[]): ResourceKey {
  return parts.join(KEY_SEPARATOR);
}

export type { ResourceKey, SlotMarkKind, StatisticIconKind };
export { ATTACK_AUDIO_VARIANTS, HEALTH_ICON_KEY, UNKNOWN_CARD_KEY, cardAudioKey, cardFrameKey, cardImageKey, slotMarkKey, statisticIconKey };
