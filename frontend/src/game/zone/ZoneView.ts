import Phaser from "phaser";
import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import ZoneSlotLayout from "@/game/zone/ZoneSlotLayout";
import StoreSystem from "@/core/StoreSystem";
import ProjectionSystem from "@/core/ProjectionSystem";
import { getText } from "@/core/Texts";
import { Point2D, Size2D, Rotation } from "@/domain/Geometry";
import { ELIMINATED_LABEL_COLOR, ELIMINATED_LABEL_FONT_SIZE, ELIMINATED_LABEL_STROKE_COLOR, ELIMINATED_LABEL_STROKE_WIDTH } from "@/core/Constants";
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

type AllZoneViewOptions = Required<ZoneViewOptions>;
type DefaultZoneViewOptions = Omit<AllZoneViewOptions, 'position' | 'rotation' | 'slotSize'>;
/** Space between the slots of a zone at its base size, in board-space units. */
const BASE_SLOT_SPACING = 20;
const defaultOptions: DefaultZoneViewOptions = {
  spaceBetweenSlots: BASE_SLOT_SPACING,
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

    if (!this.zone.owner.isAlive) {
      this.showEliminated();
    }

    if (this.options.hasTurn) {
      this.showTurnGlow();

      if (this.zone.isPlayerOwner(StoreSystem.getPlayer())) {
        this.showAttackReadyMarks();
      }
    }
  }

  /** Marks the own cards that can attack, on the turn of the board being shown (VIEW-17). */
  private showAttackReadyMarks() {
    for (const zoneSlot of this.zone.slots.flat()) {
      if (zoneSlot.combatant?.isAttackAvailable) {
        this.getSlotAt(zoneSlot.position)?.showReadyMark();
      }
    }
  }

  /** The label stays upright in every zone, so it is readable on the rotated ones (VIEW-11). */
  private showEliminated() {
    for (const slotView of this.slots.flat()) {
      slotView.showEliminatedVeil();
    }

    const label = this.scene.add.text(0, 0, getText('ui.game.eliminated'), {
      fontSize: ELIMINATED_LABEL_FONT_SIZE,
      color: ELIMINATED_LABEL_COLOR,
      stroke: ELIMINATED_LABEL_STROKE_COLOR,
      strokeThickness: ELIMINATED_LABEL_STROKE_WIDTH
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
      leaderSlotView.showTurnGlow();
    }
  }

  public getSlots(): ZoneSlotView[][] {
    return this.slots;
  }

  public getSlotAt(position: ZonePosition): ZoneSlotView | undefined {
    return this.slots[position.row]?.[position.column];
  }
}

export { BASE_SLOT_SPACING };
export default ZoneView;