import Phaser from "phaser";
import { GameScene } from "@/scenes/Game";
import Zone from "@/domain/Zone";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import ZoneSlotLayout from "@/game/zone/ZoneSlotLayout";
import StoreSystem from "@/core/StoreSystem";
import ProjectionSystem from "@/core/ProjectionSystem";
import { getText } from "@/core/Texts";
import { Point2D, Size2D, Rotation } from "@/domain/Geometry";
import { ELIMINATED_LABEL_FONT_SIZE, ELIMINATED_LABEL_OUTLINE_FRACTION, ELIMINATED_LABEL_SIZE, UI_FONT_FAMILY } from "@/core/Constants";
import { boxOfSlot } from "@/game/cards/CombatLayout";
import type { ZonePosition } from "@/domain/Position";
import { paletteText } from "@/game/utils/Palette";

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
  private slotsAreRaised = false;
  private readonly eliminatedMarks: Phaser.GameObjects.GameObject[] = [];
  private eliminatedLabel?: Phaser.GameObjects.Text;

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

  /** The label is flat and horizontal on the screen, centered on the zone as drawn, so it is readable on the rotated ones (VIEW-11). */
  private showEliminated() {
    for (const slotView of this.slots.flat()) {
      this.eliminatedMarks.push(slotView.showEliminatedVeil());
    }

    const label = this.scene.add.text(0, 0, getText('ui.game.eliminated'), {
      fontFamily: UI_FONT_FAMILY,
      fontSize: ELIMINATED_LABEL_FONT_SIZE,
      color: paletteText('ELIMINATED_LABEL'),
      stroke: paletteText('TEXT_OUTLINE'),
      strokeThickness: ELIMINATED_LABEL_SIZE * ELIMINATED_LABEL_OUTLINE_FRACTION
    });
    const center = this.drawnCenter();
    label.setOrigin(0.5, 0.5);
    label.setPosition(center.x, center.y);
    this.add(label);
    this.eliminatedLabel = label;
    this.eliminatedMarks.push(label);
  }

  /** The middle of the box that holds the slots as drawn, in the space of the zone. */
  private drawnCenter(): Point2D {
    const boxes = this.slots.flat().map((slotView) => boxOfSlot(slotView.corners, { x: slotView.x, y: slotView.y }));
    const left = Math.min(...boxes.map((box) => box.center.x - box.width / 2));
    const right = Math.max(...boxes.map((box) => box.center.x + box.width / 2));
    const top = Math.min(...boxes.map((box) => box.center.y - box.height / 2));
    const bottom = Math.max(...boxes.map((box) => box.center.y + box.height / 2));

    return { x: (left + right) / 2, y: (top + bottom) / 2 };
  }

  /** The label measures the same on the screen whatever the window and the zoom (VIEW-11, VIEW-24, VIEW-19). */
  public applyScale(unitsPerPixel: number) {
    this.eliminatedLabel?.setScale(unitsPerPixel);
  }

  /** The veils and the label of an eliminated zone, which fade in when its player is eliminated (VIEW-11). */
  public getEliminatedMarks(): Phaser.GameObjects.GameObject[] {
    return this.eliminatedMarks;
  }

  /** The turn can name a player whose leader already died until the turn changes (CON-32): then there is nothing to light. */
  private showTurnGlow() {
    const leaderSlot = this.zone.slots.flat().find((zoneSlot) => zoneSlot.allowedCombatant === 'LEADER');
    const leaderSlotView = leaderSlot && this.getSlotAt(leaderSlot.position);

    if (leaderSlot?.combatant && leaderSlotView) {
      leaderSlotView.showTurnGlow();
    }
  }

  /** Draws the slot above the others of the zone, so its card, lifted or travelling, is not covered by theirs (VIEW-4, VIEW-5). */
  public raiseSlot(slot: ZoneSlotView) {
    this.slotsAreRaised = true;
    this.bringToTop(slot);
  }

  /** Puts the slots back in the order they were created in. */
  public restoreSlotOrder() {
    if (!this.slotsAreRaised) {
      return;
    }

    this.slotsAreRaised = false;
    for (const slot of this.slots.flat()) {
      this.bringToTop(slot);
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