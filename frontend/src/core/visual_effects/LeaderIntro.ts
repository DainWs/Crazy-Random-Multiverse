import type { PlayerCode } from '@/domain/Player';
import type CombatantView from '@/game/cards/CombatantView';
import type ZoneView from '@/game/zone/ZoneView';
import type { GameScene } from '@/scenes/Game';
import { playMotion } from '@/core/visual_effects/Motion';
import * as Constants from '@/core/Constants';

/** Shortens the placement of each leader as there are more, so the start stays brief (VIEW-12). */
function calculateLeaderIntroDuration(leaderCount: number): number {
  const sharedDuration = Constants.LEADER_INTRO_TOTAL_MS / Math.max(leaderCount, 1);

  return Math.min(Math.max(sharedDuration, Constants.LEADER_INTRO_MIN_MS), Constants.LEADER_INTRO_MAX_MS);
}

/** The leaders on the board, in the order of `playerOrder`, which is the order of the zones of the game (VIEW-12). */
function findLeaders(zoneViews: ZoneView[], playerOrder: PlayerCode[]): CombatantView[] {
  const leaders: CombatantView[] = [];

  for (const playerCode of playerOrder) {
    const zoneView = zoneViews.find((candidate) => candidate.zone.owner.code === playerCode);
    const leaderSlot = zoneView?.getSlots().flat().find((slotView) => slotView.zoneSlot.allowedCombatant === 'LEADER');
    const leader = leaderSlot?.getCombatant();
    if (leader) {
      leaders.push(leader);
    }
  }

  return leaders;
}

function hideLeaders(leaders: CombatantView[]) {
  for (const leader of leaders) {
    leader.setAlpha(0);
  }
}

/** Places the leaders one after the other: each shrinks into its slot while it fades in (VIEW-12). */
async function playLeaderIntro(scene: GameScene, leaders: CombatantView[]): Promise<void> {
  const duration = calculateLeaderIntroDuration(leaders.length);

  for (const leader of leaders) {
    await placeLeader(scene, leader, duration);
  }
}

function placeLeader(scene: GameScene, leader: CombatantView, duration: number): Promise<void> {
  const { scaleX, scaleY } = leader.getOriginalScale();
  const startScale = Constants.LEADER_INTRO_START_SCALE;
  leader.setScale(scaleX * startScale, (scaleY ?? scaleX) * startScale);

  return playMotion(scene, {
    targets: leader,
    to: { alpha: 1, scaleX, scaleY: scaleY ?? scaleX },
    duration,
    curve: 'ENTER',
    kind: 'NON_ESSENTIAL'
  });
}

export { calculateLeaderIntroDuration, findLeaders, hideLeaders, playLeaderIntro };
