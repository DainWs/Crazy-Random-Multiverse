import { PlayerCode } from '@/domain/game/player';
import { Card } from '@/domain/game/card';

export type Hand = {
    owner: PlayerCode,
    cards: Card[]
};