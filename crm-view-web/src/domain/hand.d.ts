import { PlayerCode } from '@/domain/player';
import { Card } from '@/domain/card';

export type Hand = {
    owner: PlayerCode,
    cards: Card[]
};