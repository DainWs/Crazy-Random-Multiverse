import Phaser from "phaser";
import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import ZoneSlotLayout from "@/game/zone/ZoneSlotLayout";
import ProjectionSystem from "@/core/ProjectionSystem";
import { getText } from "@/core/Texts";
import { Point2D, Size2D, Rotation } from "@/domain/Geometry";
import type { Corners3D } from "@/domain/Geometry";
import { ELIMINATED_LABEL_COLOR, ELIMINATED_LABEL_FONT_SIZE, TURN_GLOW_LAYERS, TURN_GLOW_STEP } from "@/core/Constants";
import type { ZonePosition } from "@/domain/Position";

interface ZoneViewOptions {
  /** Center position in board-space */
  position: Point2D;
  /** Rotation of the zone in degrees (0=South, 180=North, 90=West, -90=East) */
  rotation: Rotation;
  /** Size of each zone slot in board-space units */
  slotSize: Size2D;
  /** Space between slots in board-space units */
  spaceBetweenSlots?: number;
  /** Whether the owner of the zone has the turn, which makes their leader glow (VIEW-20) */
  hasTurn?: boolean;
}

/** Distance in board-space between the leader slot and the label of the hand size, past it towards the edge of the table. */
const HAND_SIZE_LABEL_MARGIN = 80;
const HAND_SIZE_LABEL_FONT_SIZE = '64px';
const HAND_SIZE_LABEL_COLOR = '#ffffff';

type AllZoneViewOptions = Required<ZoneViewOptions>;
type DefaultZoneViewOptions = Omit<AllZoneViewOptions, 'position' | 'rotation' | 'slotSize'>;
const defaultOptions: DefaultZoneViewOptions = {
  spaceBetweenSlots: 20,
  hasTurn: false
};

class ZoneView extends Phaser.GameObjects.Container {
  private readonly options: AllZoneViewOptions;
  private readonly slots: ZoneSlotView[][];
  private readonly slotLayout: ZoneSlotLayout;

  public readonly zone: Zone;

  constructor(
    scene: GameScene,
    zone: Zone,
    options: ZoneViewOptions
  ) {
    super(scene, 0, 0);

    this.options = { ...defaultOptions, ...options };
    this.slots = [];
    this.zone = zone;
    this.scale = 1;
    this.slotLayout = new ZoneSlotLayout(this.options);

    // Project zone center: board-space → screen-space
    const zoneScreen = ProjectionSystem.toPoint3D(this.options.position);
    this.setPosition(zoneScreen.x, zoneScreen.y);

    this.initializeView();
  }

  private initializeView() {
    const zoneSlots = this.zone.slots.flatMap(row => row);
    const numRows = this.zone.slots.length;

    for (const zoneSlot of zoneSlots) {
      const position = zoneSlot.position;
      const numCols = this.zone.slots[position.row].length;
      const obb = this.slotLayout.resolveOBBForSlot(position, { x: this.x, y: this.y }, numRows, numCols);
      const zoneSlotView = new ZoneSlotView(this.scene as GameScene, obb, zoneSlot);
      zoneSlotView.setZone(this.zone);

      if (!this.slots[position.row]) this.slots[position.row] = [];
      this.slots[position.row][position.column] = zoneSlotView;
      this.add(zoneSlotView);
    }

    if (this.zone.team === 'ENEMY' && this.zone.owner.isAlive) {
      this.add(this.createHandSizeLabel());
    }

    if (!this.zone.owner.isAlive) {
      this.showEliminated();
    }

    if (this.options.hasTurn) {
      this.showTurnGlow();
    }
  }

  /** The label stays upright in every zone, so it is readable on the rotated ones (VIEW-11). */
  private showEliminated() {
    for (const slotView of this.slots.flat()) {
      slotView.showEliminatedVeil();
    }

    const label = this.scene.add.text(0, 0, getText('ui.game.eliminated'), {
      fontSize: ELIMINATED_LABEL_FONT_SIZE,
      color: ELIMINATED_LABEL_COLOR
    });
    label.setOrigin(0.5, 0.5);
    label.setScale(ProjectionSystem.toPoint3D(this.options.position).scale);
    this.add(label);
  }

  /** The turn can name a player whose leader already died until the turn changes (CON-32): then there is nothing to light. */
  private showTurnGlow() {
    const leaderSlot = this.zone.slots.flat().find((zoneSlot) => zoneSlot.allowedCombatant === 'LEADER');
    const leaderSlotView = leaderSlot && this.getSlotAt(leaderSlot.position);

    if (leaderSlot?.combatant && leaderSlotView) {
      const outlines: Corners3D[] = [];

      for (let layer = TURN_GLOW_LAYERS; layer >= 1; layer--) {
        outlines.push(this.slotLayout.expandCorners(leaderSlotView.corners, layer * TURN_GLOW_STEP));
      }

      leaderSlotView.showTurnGlow(outlines);
    }
  }

  /** A rival hand is private, so only how many cards it holds is shown (HAND-3, UI-7). */
  private createHandSizeLabel(): Phaser.GameObjects.Text[] {
    const leaderSlot = this.zone.slots.flat().find((zoneSlot) => zoneSlot.allowedCombatant === 'LEADER');
    const labels: Phaser.GameObjects.Text[] = [];

    if (leaderSlot) {
      const numRows = this.zone.slots.length;
      const numCols = this.zone.slots[leaderSlot.position.row].length;
      const distance = this.options.slotSize.height / 2 + HAND_SIZE_LABEL_MARGIN;
      const board = this.slotLayout.calculateBoardPositionBehindSlot(leaderSlot.position, numRows, numCols, distance);
      const screen = ProjectionSystem.toPoint3D(board);

      const label = this.scene.add.text(screen.x - this.x, screen.y - this.y, `${getText('ui.game.hand_size')} ${this.zone.owner.handSize}`, {
        fontSize: HAND_SIZE_LABEL_FONT_SIZE,
        color: HAND_SIZE_LABEL_COLOR
      });
      label.setOrigin(0.5, 0.5);
      label.setScale(screen.scale);
      labels.push(label);
    }

    return labels;
  }

  public getSlots(): ZoneSlotView[][] {
    return this.slots;
  }

  public getSlotAt(position: ZonePosition): ZoneSlotView | undefined {
    return this.slots[position.row]?.[position.column];
  }
}

export default ZoneView;