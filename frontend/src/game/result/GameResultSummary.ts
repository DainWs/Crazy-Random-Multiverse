import type { GameResult } from '@/core/StoreSystem';
import type { PlayerCode } from '@/domain/Player';

type GameResultSummary = {
    isVictory: boolean;
    winnerName: string;
};

/** What the result says to the local player: victory only for the winner, defeat for everybody else, spectators included (WIN-4). */
function summarizeResult(result: GameResult, localPlayerCode: PlayerCode): GameResultSummary {
    const winner = result.winner;
    return { isVictory: winner?.code === localPlayerCode, winnerName: winner?.name ?? '' };
}

export type { GameResultSummary };
export { summarizeResult };
