import { beforeEach, describe, expect, it, vi } from 'vitest';
import type CombatantView from '@/game/cards/CombatantView';
import type ZoneView from '@/game/zone/ZoneView';
import type { GameScene } from '@/scenes/Game';
import * as Constants from '@/core/Constants';
import { calculateLeaderIntroDuration, findLeaders, hideLeaders, playLeaderIntro } from '@/core/visual_effects/LeaderIntro';

type FakeLeader = { name: string; alpha: number; setAlpha: (alpha: number) => void; getOriginalScale: () => unknown; setScale: () => void };

const createLeader = (name: string): FakeLeader => {
  const leader: FakeLeader = {
    name,
    alpha: 1,
    setAlpha: (alpha) => {
      leader.alpha = alpha;
    },
    getOriginalScale: () => ({ scaleX: 0.5, scaleY: 0.5 }),
    setScale: () => undefined
  };
  return leader;
};

const createZoneView = (ownerCode: string, leader: FakeLeader | null): ZoneView => {
  const slots = [
    [{ zoneSlot: { allowedCombatant: 'LEADER' }, getCombatant: () => leader }],
    [{ zoneSlot: { allowedCombatant: 'WARRIOR' }, getCombatant: () => createLeader('warrior') }]
  ];
  return { zone: { owner: { code: ownerCode } }, getSlots: () => slots } as unknown as ZoneView;
};

describe('LeaderIntro', () => {
  describe('calculateLeaderIntroDuration', () => {
    it.each([
      { leaders: 2, expected: Constants.LEADER_INTRO_MAX_MS },
      { leaders: 4, expected: 500 },
      { leaders: 8, expected: 250 },
      { leaders: 10, expected: 200 },
      { leaders: 100, expected: Constants.LEADER_INTRO_MIN_MS },
      { leaders: 0, expected: Constants.LEADER_INTRO_MAX_MS }
    ])('takes $expected ms per leader with $leaders leaders', ({ leaders, expected }) => {
      expect(calculateLeaderIntroDuration(leaders)).toBe(expected);
    });

    // VIEW-12
    it('keeps the whole intro within 2 seconds with 10 players', () => {
      expect(calculateLeaderIntroDuration(10) * 10).toBeLessThanOrEqual(2000);
    });
  });

  describe('findLeaders', () => {
    // VIEW-12
    it('returns the leaders in the order of the players', () => {
      const [first, second] = [createLeader('first'), createLeader('second')];
      const zoneViews = [createZoneView('p2', second), createZoneView('p1', first)];

      const leaders = findLeaders(zoneViews, ['p1', 'p2']);

      expect(leaders).toEqual([first, second]);
    });

    it('skips a zone with no leader', () => {
      const zoneViews = [createZoneView('p1', null), createZoneView('p2', createLeader('second'))];

      expect(findLeaders(zoneViews, ['p1', 'p2'])).toHaveLength(1);
    });
  });

  describe('hideLeaders', () => {
    it('makes the leaders transparent', () => {
      const leader = createLeader('leader');

      hideLeaders([leader as unknown as CombatantView]);

      expect(leader.alpha).toBe(0);
    });
  });

  describe('playLeaderIntro', () => {
    let placed: string[];
    let scene: GameScene;

    beforeEach(() => {
      placed = [];
      scene = {
        events: { once: vi.fn() },
        tweens: {
          add: (config: { targets: FakeLeader; onComplete: () => void }) => {
            placed.push(config.targets.name);
            config.onComplete();
          }
        }
      } as unknown as GameScene;
    });

    // VIEW-12
    it('places the leaders one after the other in order', async () => {
      const leaders = [createLeader('first'), createLeader('second'), createLeader('third')] as unknown as CombatantView[];

      await playLeaderIntro(scene, leaders);

      expect(placed).toEqual(['first', 'second', 'third']);
    });

    it('waits for a leader to be placed before the next one', async () => {
      const completions: (() => void)[] = [];
      scene = {
        events: { once: vi.fn() },
        tweens: { add: (config: { onComplete: () => void }) => completions.push(config.onComplete) }
      } as unknown as GameScene;
      const leaders = [createLeader('first'), createLeader('second')] as unknown as CombatantView[];

      void playLeaderIntro(scene, leaders);
      await Promise.resolve();

      expect(completions).toHaveLength(1);
    });
  });
});
