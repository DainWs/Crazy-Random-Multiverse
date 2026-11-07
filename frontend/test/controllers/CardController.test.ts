import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { gameApi } from '@/api';
import { ApiException } from '@/api/models/ApiException';
import CardController from '@/controllers/CardController';
import Player from '@/domain/Player';
import { ZonePosition } from '@/domain/Position';
import type CombatantView from '@/game/cards/CombatantView';
import type EquipmentView from '@/game/cards/EquipmentView';
import type HandView from '@/game/hand/HandView';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';

const ROW_COUNT = 3;
const GAME_CODE = 'game-1';
const player = new Player('p-1', 'One');

const canPlayerAct = vi.hoisted(() => vi.fn(() => true));

vi.mock('@/api', () => ({ gameApi: { sendPlayerAction: vi.fn() } }));
vi.mock('@/core/StoreSystem', () => ({
  default: {
    getGameConfiguration: () => ({ gameCode: GAME_CODE }),
    getPlayer: () => player,
    canPlayerAct,
    getPlayerZone: () => ({ slots: new Array(ROW_COUNT) })
  }
}));

/** A slot that keeps the card it shows, so the tests check what is on the board and not the calls. */
class FakeZoneSlot {
  public held: unknown;
  public accepts = true;
  public attacks = true;
  public zone: { owner: Player } = { owner: player };
  public readonly zoneSlot: { position: ZonePosition };

  public constructor(row: number, column: number, held: unknown = null) {
    this.zoneSlot = { position: new ZonePosition(row, column) };
    this.held = held;
  }

  public canReceive(): boolean {
    return this.accepts;
  }

  public canReceiveFrom(): boolean {
    return this.accepts;
  }

  public canAttack(): boolean {
    return this.attacks;
  }

  public getCombatant(): unknown {
    return this.held;
  }

  public holdCard(view: unknown): void {
    this.held = view;
  }

  public releaseCard(): unknown {
    const heldCard = this.held;
    this.held = null;
    return heldCard;
  }
}

/** A hand that keeps the cards it shows: the dragged card stays in the list of cards, as in the real one. */
class FakeHand {
  public readonly cards: unknown[];
  public readonly shown: unknown[];

  public constructor(cards: unknown[]) {
    this.cards = cards;
    this.shown = cards.slice(0, cards.length - 1);
  }

  public getCards(): unknown[] {
    return this.cards;
  }

  public addAt(view: unknown, index: number): void {
    this.shown.splice(index, 0, view);
  }
}

describe('CardController', () => {
  let onRejected: Mock<(key: string) => void>;
  let controller: CardController;
  let cardView: CombatantView;
  let hand: FakeHand;
  let handView: HandView;
  let slot: FakeZoneSlot;
  let slotView: ZoneSlotView;
  const sendPlayerAction = vi.mocked(gameApi.sendPlayerAction);

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve));

  const asSlotView = (fakeSlot: FakeZoneSlot) => fakeSlot as unknown as ZoneSlotView;

  beforeEach(() => {
    vi.clearAllMocks();
    canPlayerAct.mockReturnValue(true);
    onRejected = vi.fn<(key: string) => void>();
    controller = new CardController(onRejected);
    cardView = { card: { code: { code: '1', type: 'WARRIOR' } }, reset: vi.fn() } as unknown as CombatantView;
    hand = new FakeHand([{}, cardView]);
    handView = hand as unknown as HandView;
    slot = new FakeZoneSlot(1, 2);
    slotView = asSlotView(slot);
    sendPlayerAction.mockResolvedValue(undefined);
  });

  describe('putCardOnZoneSlot', () => {
    it('returns true and shows the card in the slot', () => {
      const result = controller.putCardOnZoneSlot(cardView, handView, slotView);

      expect(result).toBe(true);
      expect(slot.held).toBe(cardView);
    });

    it('sends a PUT_ACTION with the card, the player and the slot position', () => {
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      const [type, action, rowCount] = sendPlayerAction.mock.calls[0];
      expect([type, rowCount]).toEqual(['PUT_ACTION', ROW_COUNT]);
      expect(action).toMatchObject({ game: GAME_CODE, sourceCard: cardView.card, sourcePlayer: player, targetPlayer: player, targetPosition: { row: 1, column: 2 } });
    });

    it('rejects the drop and sends nothing when the slot cannot receive the card', () => {
      slot.accepts = false;

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

      expect(slot.held).toBe(cardView);
    });

    // UI-6
    it('empties the slot when the server rejects the action', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      await flushPromises();

      expect(slot.held).toBeNull();
    });

    it('returns the card to its place in the hand when the server rejects the action', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.putCardOnZoneSlot(cardView, handView, slotView);

      await flushPromises();

      expect(hand.shown[1]).toBe(cardView);
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
    let fromSlot: FakeZoneSlot;
    let swappedView: CombatantView;

    beforeEach(() => {
      swappedView = {} as CombatantView;
      fromSlot = new FakeZoneSlot(1, 0, cardView);
    });

    it('returns true and shows the card in the target slot', () => {
      const result = controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      expect(result).toBe(true);
      expect(slot.held).toBe(cardView);
    });

    it('leaves the source slot empty when the target slot was free', () => {
      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      expect(fromSlot.held).toBeNull();
    });

    it('sends a MOVE_ACTION with the source and target positions', () => {
      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      const [type, action, rowCount] = sendPlayerAction.mock.calls[0];
      expect([type, rowCount]).toEqual(['MOVE_ACTION', ROW_COUNT]);
      expect(action).toMatchObject({ game: GAME_CODE, sourcePlayer: player, targetPlayer: player, sourcePosition: { row: 1, column: 0 }, targetPosition: { row: 1, column: 2 } });
    });

    // BOARD-7
    it('shows the card of the target slot in the source slot on a swap', () => {
      slot = new FakeZoneSlot(1, 2, swappedView);

      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), asSlotView(slot));

      expect(fromSlot.held).toBe(swappedView);
    });

    it('rejects the move and sends nothing when the target slot cannot receive the card', () => {
      slot.accepts = false;

      const result = controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    it('rejects the move of a card that is not in the source slot', () => {
      fromSlot = new FakeZoneSlot(1, 0, {});

      const result = controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      expect(result).toBe(false);
    });

    // CON-19
    it('rejects a move while another action is pending', () => {
      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      const result = controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      expect(result).toBe(false);
    });

    // UI-6
    it('shows the card in its source slot again when the server rejects the move', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      await flushPromises();

      expect(fromSlot.held).toBe(cardView);
    });

    it('empties the target slot again when the server rejects the move', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      await flushPromises();

      expect(slot.held).toBeNull();
    });

    it('shows the swapped card in the target slot again when the server rejects the move', async () => {
      slot = new FakeZoneSlot(1, 2, swappedView);
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), asSlotView(slot));

      await flushPromises();

      expect(slot.held).toBe(swappedView);
    });

    it('reports the key of the rejection', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.selected_target_position_not_allowed'));
      controller.moveCardOnZoneSlot(cardView, asSlotView(fromSlot), slotView);

      await flushPromises();

      expect(onRejected).toHaveBeenCalledWith('exception.player-action.selected_target_position_not_allowed');
    });
  });

  describe('equipCardOnZoneSlot', () => {
    let equipment: { card: unknown; visible: boolean; setVisible: (visible: boolean) => void; reset: () => void };
    let equipmentView: EquipmentView;

    beforeEach(() => {
      equipment = {
        card: { code: { code: '0', type: 'EQUIPMENT' } },
        visible: true,
        setVisible(visible: boolean) {
          this.visible = visible;
        },
        reset: vi.fn()
      };
      equipmentView = equipment as unknown as EquipmentView;
      hand = new FakeHand([{}, equipmentView]);
      handView = hand as unknown as HandView;
    });

    it('returns true and hides the equipment while the server answers', () => {
      const result = controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      expect(result).toBe(true);
      expect(equipment.visible).toBe(false);
    });

    it('sends an EQUIP_ACTION with the equipment, the player and the slot position', () => {
      controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      const [type, action, rowCount] = sendPlayerAction.mock.calls[0];
      expect([type, rowCount]).toEqual(['EQUIP_ACTION', ROW_COUNT]);
      expect(action).toMatchObject({ game: GAME_CODE, sourceCard: equipment.card, sourcePlayer: player, targetPlayer: player, targetPosition: { row: 1, column: 2 } });
    });

    it('rejects the drop and sends nothing when the slot cannot receive the equipment', () => {
      slot.accepts = false;

      const result = controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    // CON-19
    it('rejects a second drop while the first action is pending', () => {
      controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      const result = controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      expect(result).toBe(false);
    });

    // UI-6
    it('shows the equipment again when the server rejects the action', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.equip_target_not_owned'));
      controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      await flushPromises();

      expect(equipment.visible).toBe(true);
    });

    it('returns the equipment to its place in the hand when the server rejects the action', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.equip_target_not_owned'));
      controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      await flushPromises();

      expect(hand.shown[1]).toBe(equipmentView);
    });

    it('reports the key of the rejection', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.equip_target_not_owned'));
      controller.equipCardOnZoneSlot(equipmentView, handView, slotView);

      await flushPromises();

      expect(onRejected).toHaveBeenCalledWith('exception.player-action.equip_target_not_owned');
    });
  });

  // UI-4
  describe('when it is not the turn of the player', () => {
    beforeEach(() => {
      canPlayerAct.mockReturnValue(false);
    });

    it('rejects the drop of a card and sends nothing', () => {
      const result = controller.putCardOnZoneSlot(cardView, handView, slotView);

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    it('rejects passing the turn and sends nothing', () => {
      const result = controller.passTurn();

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    it('rejects surrendering and sends nothing', () => {
      const result = controller.surrender();

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    it('reports that it cannot act', () => {
      expect(controller.canAct()).toBe(false);
    });
  });

  describe('passTurn', () => {
    it('sends a PASS_TURN with the player and no cards or positions', () => {
      controller.passTurn();

      const [type, action] = sendPlayerAction.mock.calls[0];
      expect(type).toBe('PASS_TURN');
      expect(action).toMatchObject({ game: GAME_CODE, sourcePlayer: player, sourceCard: null, sourcePosition: null, targetPosition: null });
    });

    // CON-19
    it('rejects a second command while the first one is pending', () => {
      controller.passTurn();

      const result = controller.surrender();

      expect(result).toBe(false);
      expect(sendPlayerAction).toHaveBeenCalledTimes(1);
    });

    // UI-6
    it('reports the key of the rejection', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.allowed_only_on_turn'));
      controller.passTurn();

      await flushPromises();

      expect(onRejected).toHaveBeenCalledWith('exception.player-action.allowed_only_on_turn');
    });
  });

  describe('surrender', () => {
    it('sends a SURRENDER_ACTION with the player', () => {
      controller.surrender();

      const [type, action] = sendPlayerAction.mock.calls[0];
      expect(type).toBe('SURRENDER_ACTION');
      expect(action).toMatchObject({ game: GAME_CODE, sourcePlayer: player });
    });
  });

  describe('attackCardOnZoneSlot', () => {
    let fromSlot: FakeZoneSlot;
    let targetSlot: FakeZoneSlot;
    const rival = new Player('p-2', 'Two');

    beforeEach(() => {
      fromSlot = new FakeZoneSlot(1, 0, cardView);
      targetSlot = new FakeZoneSlot(0, 1, {});
      targetSlot.zone = { owner: rival };
    });

    it('returns true and sends an ATTACK_ACTION with both positions and the owner of the target', () => {
      const result = controller.attackCardOnZoneSlot(asSlotView(fromSlot), asSlotView(targetSlot));

      const [type, action, rowCount] = sendPlayerAction.mock.calls[0];
      expect(result).toBe(true);
      expect([type, rowCount]).toEqual(['ATTACK_ACTION', ROW_COUNT]);
      expect(action).toMatchObject({
        game: GAME_CODE,
        sourcePlayer: player,
        sourcePosition: { row: 1, column: 0 },
        targetPlayer: rival,
        targetPosition: { row: 0, column: 1 }
      });
    });

    it('keeps the cards where they are', () => {
      controller.attackCardOnZoneSlot(asSlotView(fromSlot), asSlotView(targetSlot));

      expect([fromSlot.held, targetSlot.held]).toEqual([cardView, {}]);
    });

    it('rejects the attack and sends nothing when the source cannot attack the target', () => {
      fromSlot.attacks = false;

      const result = controller.attackCardOnZoneSlot(asSlotView(fromSlot), asSlotView(targetSlot));

      expect(result).toBe(false);
      expect(sendPlayerAction).not.toHaveBeenCalled();
    });

    // CON-19
    it('rejects a second attack while the first action is pending', () => {
      controller.attackCardOnZoneSlot(asSlotView(fromSlot), asSlotView(targetSlot));

      const result = controller.attackCardOnZoneSlot(asSlotView(fromSlot), asSlotView(targetSlot));

      expect(result).toBe(false);
      expect(sendPlayerAction).toHaveBeenCalledTimes(1);
    });

    // UI-6
    it('reports the key of the rejection', async () => {
      sendPlayerAction.mockRejectedValue(new ApiException('exception.player-action.selected_target_is_protected'));
      controller.attackCardOnZoneSlot(asSlotView(fromSlot), asSlotView(targetSlot));

      await flushPromises();

      expect(onRejected).toHaveBeenCalledWith('exception.player-action.selected_target_is_protected');
    });
  });
});
