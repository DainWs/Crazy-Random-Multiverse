import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { gameApi } from '@/api';
import { ApiException } from '@/api/models/ApiException';
import CardController from '@/controllers/CardController';
import Player from '@/domain/Player';
import { ZonePosition } from '@/domain/Position';
import type CombatantView from '@/game/cards/CombatantView';
import type HandView from '@/game/hand/HandView';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';

const ROW_COUNT = 3;
const GAME_CODE = 'game-1';
const player = new Player('p-1', 'One');

vi.mock('@/api', () => ({ gameApi: { sendPlayerAction: vi.fn() } }));
vi.mock('@/core/StoreSystem', () => ({
  default: {
    getGameConfiguration: () => ({ gameCode: GAME_CODE }),
    getPlayer: () => player,
    getPlayerZone: () => ({ slots: new Array(ROW_COUNT) })
  }
}));

describe('CardController', () => {
  let onRejected: Mock<(key: string) => void>;
  let controller: CardController;
  let cardView: CombatantView;
  let handView: HandView;
  let slotView: ZoneSlotView;
  const sendPlayerAction = vi.mocked(gameApi.sendPlayerAction);

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve));

  beforeEach(() => {
    vi.clearAllMocks();
    onRejected = vi.fn<(key: string) => void>();
    controller = new CardController(onRejected);
    cardView = { card: { code: { code: '1', type: 'WARRIOR' } }, reset: vi.fn() } as unknown as CombatantView;
    handView = { addAt: vi.fn(), getCards: vi.fn(() => [{}, cardView]) } as unknown as HandView;
    slotView = {
      canReceive: vi.fn(() => true),
      holdCard: vi.fn(),
      releaseCard: vi.fn(),
      zoneSlot: { position: new ZonePosition(1, 2) }
    } as unknown as ZoneSlotView;
    sendPlayerAction.mockResolvedValue(undefined);
  });

  describe('putCardOnZoneSlot', () => {
    it('returns true and holds the card in the slot', () => {
      const result = controller.putCardOnZoneSlot(cardView, handView, slotView);

      expect(result).toBe(true);
      expect(slotView.holdCard).toHaveBeenCalledWith(cardView);
    });

    it('sends a PUT_ACTION with the card, the player and the slot position', () => {
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      const [type, action, rowCount] = sendPlayerAction.mock.calls[0];
      expect([type, rowCount]).toEqual(['PUT_ACTION', ROW_COUNT]);
      expect(action).toMatchObject({ game: GAME_CODE, sourceCard: cardView.card, sourcePlayer: player, targetPlayer: player, targetPosition: { row: 1, column: 2 } });
    });

    it('rejects the drop and sends nothing when the slot cannot receive the card', () => {
      vi.mocked(slotView.canReceive).mockReturnValue(false);

      const result = controller.putCardOnZoneSlot(cardView, handView, slotView);

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    // CON-19
    it('rejects a second drop while the first action is pending', () => {
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      const result = controller.putCardOnZoneSlot(cardView, handView, slotView);

      expect(result).toBe(false);
      expect(sendPlayerAction).toHaveBeenCalledTimes(1);
    });

    it('reports the action as pending until the server answers', async () => {
      controller.putCardOnZoneSlot(cardView, handView, slotView);
      const pendingWhileSending = controller.isActionPending();

      await flushPromises();

      expect([pendingWhileSending, controller.isActionPending()]).toEqual([true, false]);
    });

    it('keeps the card in the slot when the server accepts the action', async () => {
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      await flushPromises();

      expect(slotView.releaseCard).not.toHaveBeenCalled();
    });

    // UI-6
    it('returns the card to its place in the hand when the server rejects the action', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      await flushPromises();

      expect(slotView.releaseCard).toHaveBeenCalled();
      expect(handView.addAt).toHaveBeenCalledWith(cardView, 1);
    });

    it('reports the key of the rejection', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      await flushPromises();

      expect(onRejected).toHaveBeenCalledWith('exception.player-action.allowed_only_on_turn');
    });

    it('reports the unexpected error key when the request fails', async () => {
      sendPlayerAction.mockRejectedValue(new Error('Failed to fetch'));
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      await flushPromises();

      expect(onRejected).toHaveBeenCalledWith('exception.unexpected');
    });
  });

  describe('moveCardOnZoneSlot', () => {
    let fromSlot: ZoneSlotView;
    let swappedView: CombatantView;

    const createSlot = (row: number, column: number, heldCard: CombatantView | null, isOwnZone = true): ZoneSlotView => {
      return {
        zone: { isPlayerOwner: vi.fn(() => isOwnZone) },
        zoneSlot: { position: new ZonePosition(row, column) },
        getCombatant: vi.fn(() => heldCard),
        canReceiveFrom: vi.fn(() => true),
        holdCard: vi.fn(),
        releaseCard: vi.fn(() => heldCard)
      } as unknown as ZoneSlotView;
    };

    beforeEach(() => {
      swappedView = {} as CombatantView;
      fromSlot = createSlot(1, 0, cardView);
      slotView = createSlot(1, 2, null);
    });

    it('returns true and shows the card in the target slot', () => {
      const result = controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      expect(result).toBe(true);
      expect(slotView.holdCard).toHaveBeenCalledWith(cardView);
    });

    it('sends a MOVE_ACTION with the source and target positions', () => {
      controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      const [type, action, rowCount] = sendPlayerAction.mock.calls[0];
      expect([type, rowCount]).toEqual(['MOVE_ACTION', ROW_COUNT]);
      expect(action).toMatchObject({ game: GAME_CODE, sourcePlayer: player, targetPlayer: player, sourcePosition: { row: 1, column: 0 }, targetPosition: { row: 1, column: 2 } });
    });

    // BOARD-7
    it('shows the card of the target slot in the source slot on a swap', () => {
      slotView = createSlot(1, 2, swappedView);

      controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      expect(fromSlot.holdCard).toHaveBeenCalledWith(swappedView);
    });

    it('rejects the move and sends nothing when the target slot cannot receive the card', () => {
      vi.mocked(slotView.canReceiveFrom).mockReturnValue(false);

      const result = controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    it('rejects the move of a card outside the zone of the player', () => {
      fromSlot = createSlot(1, 0, cardView, false);

      const result = controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    // CON-19
    it('rejects a move while another action is pending', () => {
      controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      const result = controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      expect(result).toBe(false);
    });

    // UI-6
    it('shows the card in its source slot again when the server rejects the move', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      await flushPromises();

      expect(vi.mocked(fromSlot.holdCard).mock.calls.at(-1)).toEqual([cardView]);
    });

    it('shows the swapped card in the target slot again when the server rejects the move', async () => {
      slotView = createSlot(1, 2, swappedView);
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      await flushPromises();

      expect(vi.mocked(slotView.holdCard).mock.calls.at(-1)).toEqual([swappedView]);
    });

    it('reports the key of the rejection', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.selected_target_position_not_allowed'));
      controller.moveCardOnZoneSlot(cardView, fromSlot, slotView);

      await flushPromises();

      expect(onRejected).toHaveBeenCalledWith('exception.player-action.selected_target_position_not_allowed');
    });
  });
});
