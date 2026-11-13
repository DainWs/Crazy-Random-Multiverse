import Phaser from "phaser";
import applyAnimation from "@/core/visual_effects/ZoneSlotAnimation";
import { prefersReducedMotion, pulseWave, readyMarkAlpha } from "@/core/visual_effects/ReadyMarkPulse";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import { ZoneSlotAnimations } from "@/core/visual_effects/ZoneSlotAnimation";
import type Card from "@/domain/Card";
import type Zone from "@/domain/Zone";
import ZoneSlot from "@/domain/ZoneSlot";
import { Corners3D, OrientedBoundingBox3D, Point3D, Rotation } from "@/domain/Geometry";
import StoreSystem from "@/core/StoreSystem";
import ZoneSlotViewRenderer from "@/game/zone/ZoneSlotViewRenderer";
import zoneSlotCardHelper from "@/game/zone/ZoneSlotCardHelper";
import CombatantView from "@/game/cards/CombatantView";
import {
  HIT_FLASH_DURATION_MS, OWN_SLOT_BORDER_COLOR, OWN_SLOT_COLOR, SLOT_MARKER_READY_COLOR, TURN_GLOW_COLOR, TURN_GLOW_MIN_ALPHA, TURN_GLOW_PULSE_PERIOD_MS
} from "@/core/Constants";

class ZoneSlotView extends Phaser.GameObjects.Container implements CombatantViewHolder {
  private backgroundGraphics: Phaser.GameObjects.Graphics;
  private mark: Phaser.GameObjects.Image;
  private markerGraphics?: Phaser.GameObjects.Graphics;
  private readyGraphics?: Phaser.GameObjects.Graphics;
  private glowGraphics?: Phaser.GameObjects.Graphics;
  private turnFramePulses = false;
  private cardView: CombatantView | null;

  private previewedCardView?: CombatantView | null;
  public zone: Zone;

  public readonly zoneSlot: ZoneSlot;
  public readonly centerPoint: Point3D;
  public readonly corners: Corners3D;
  public readonly slotRotation: Rotation;

  constructor(
    scene: Phaser.Scene, 
    orientedBoundingBox: OrientedBoundingBox3D,
    zoneSlot: ZoneSlot
  ) {
    super(scene, orientedBoundingBox.x, orientedBoundingBox.y);
    this.scale = 1;
    this.centerPoint = orientedBoundingBox;
    this.corners = orientedBoundingBox.corners;
    this.slotRotation = orientedBoundingBox.rotation;

    this.cardView = null;
    this.zoneSlot = zoneSlot;

    this.initializeView();
    this.setupHitArea();

    InteractiveObjectManager.registerGameObject(this.scene, this);
  }

  private setupHitArea() {
    const polygon = new Phaser.Geom.Polygon([
      this.corners.tl.x, this.corners.tl.y,
      this.corners.tr.x, this.corners.tr.y,
      this.corners.br.x, this.corners.br.y,
      this.corners.bl.x, this.corners.bl.y
    ]);
    
    this.setInteractive(polygon, Phaser.Geom.Polygon.Contains, true);
  }

  private initializeView() {
    this.backgroundGraphics = this.scene.add.graphics();
    this.mark = this.scene.add.image(0, 0, this.zoneSlot.getMaskTexture());

    ZoneSlotViewRenderer.render(this.backgroundGraphics, this.mark, this);

    this.add([ this.backgroundGraphics, this.mark ]);
  }

  public setZone(zone: Zone) {
    this.zone = zone;
    this.restoreBackground();
  }

  /** The slots of the local player's zone are tinted, so their cards are told apart from the rivals' (VIEW-27). */
  public restoreBackground() {
    if (this.zone.isPlayerOwner(StoreSystem.getPlayer())) {
      this.setBackgroundColor(OWN_SLOT_COLOR, OWN_SLOT_BORDER_COLOR);
    } else {
      this.setBackgroundColor(0xffffff);
    }
  }

  public canReceive(card: Card): boolean {
    const player = StoreSystem.getPlayer();

    return this.zone.canPlaceCard(this.zoneSlot.position, card, player);
  }

  /** Whether the card in `source` can be moved or swapped here (BOARD-7). */
  public canReceiveFrom(source: ZoneSlotView): boolean {
    const player = StoreSystem.getPlayer();

    return this.zone.canMoveCard(source.zoneSlot, this.zoneSlot, player);
  }

  /** Whether the card here can attack the card in `target` (COMBAT-11, COMBAT-12). */
  public canAttack(target: ZoneSlotView): boolean {
    const player = StoreSystem.getPlayer();

    return this.zone.canAttackCard(this.zoneSlot, target.zone, target.zoneSlot, player);
  }

  /** Shows a card here while the server answers, without changing the game state (ARCH-2). */
  public holdCard(combatantView: CombatantView) {
    this.cardView = combatantView;
    this.add(this.cardView);

    zoneSlotCardHelper.applyCardTransformations(this, combatantView);
  }

  public releaseCard(): CombatantView | null {
    const heldCard = this.cardView;
    if (heldCard) {
      this.remove(heldCard);
      heldCard.clearWarp();
      this.cardView = null;
    }

    return heldCard;
  }

  public setCard(combatantView: CombatantView) {
    this.zoneSlot.combatant = combatantView.combatant;
    this.cardView = combatantView;
    this.add(this.cardView);

    zoneSlotCardHelper.applyCardTransformations(this, combatantView);
  }

  public removeCard() {
    this.zoneSlot.combatant = null;
    if (this.cardView) {
      this.remove(this.cardView);
      this.cardView.clearWarp();
      this.cardView = null;
    }
  }

  public previewCard(view: CombatantView) {
    if (!this.previewedCardView) {
      this.previewedCardView = view;

      zoneSlotCardHelper.previewCard(this, view);
    }
  }

  public stopPreviewingCard() {
    if (this.previewedCardView) {
      this.scene.tweens.killTweensOf(this.previewedCardView);
      this.previewedCardView = null;
    }
  }

  public getCard(): CombatantView | null {
    return this.cardView;
  }

  public getCombatant(): CombatantView | null {
    return this.cardView;
  }

  /** Covers the slot with a color that fades out, for the hit of an attack (VIEW-5). */
  public flash(color: number): Promise<void> {
    const flashGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderBackground(flashGraphics, this.corners, color, color);
    this.add(flashGraphics);

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: flashGraphics,
        alpha: 0,
        duration: HIT_FLASH_DURATION_MS,
        onComplete: () => {
          flashGraphics.destroy();
          resolve();
        }
      });
    });
  }

  /** Frames this slot, for the player with the turn, over its own border and under its card, with a pulse that follows the clock of the scene (VIEW-20). */
  public showTurnGlow() {
    this.glowGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderMarker(this.glowGraphics, this.corners, TURN_GLOW_COLOR);
    this.add(this.glowGraphics);

    this.turnFramePulses = !prefersReducedMotion();
    this.pulseTurnGlow();
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.pulseTurnGlow, this);
  }

  private pulseTurnGlow = () => {
    const wave = this.turnFramePulses ? pulseWave(this.scene.time.now, TURN_GLOW_PULSE_PERIOD_MS) : 1;
    this.glowGraphics?.setAlpha(TURN_GLOW_MIN_ALPHA + (1 - TURN_GLOW_MIN_ALPHA) * wave);
  };

  /** Covers the slot with a dark veil, for the zone of an eliminated player (VIEW-11). */
  public showEliminatedVeil() {
    const veilGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderVeil(veilGraphics, this.corners);
    this.add(veilGraphics);
  }

  /** Frames the slot over its card (UI-5, VIEW-4). */
  public showMarker(color: number) {
    this.markerGraphics ??= this.scene.add.graphics();
    ZoneSlotViewRenderer.renderMarker(this.markerGraphics, this.corners, color);
    this.add(this.markerGraphics);
    this.bringToTop(this.markerGraphics);
  }

  /** Frames an own card that can attack now with a pulse, under the frames of `showMarker` (VIEW-17). */
  public showReadyMark() {
    this.readyGraphics ??= this.scene.add.graphics();
    ZoneSlotViewRenderer.renderMarker(this.readyGraphics, this.corners, SLOT_MARKER_READY_COLOR);
    this.add(this.readyGraphics);
    this.bringToTop(this.readyGraphics);

    if (prefersReducedMotion()) {
      return;
    }

    this.pulseReadyMark();
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.pulseReadyMark, this);
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.pulseTurnGlow, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.pulseReadyMark, this);
  }

  private pulseReadyMark = () => {
    this.readyGraphics?.setAlpha(readyMarkAlpha(this.scene.time.now));
  };

  public hideMarker() {
    this.markerGraphics?.destroy();
    this.markerGraphics = undefined;
  }

  public setBackgroundColor(color: number, borderColor?: number): void {
    ZoneSlotViewRenderer.renderBackground(this.backgroundGraphics, this.corners, color, borderColor);
  }

  public applyAnimation(animation: ZoneSlotAnimations) {
    applyAnimation(this, animation);
  }

  public canBeClicked(): boolean {
    return false;
  }

  protected preDestroy(): void {
    super.preDestroy();
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.pulseReadyMark, this);
    InteractiveObjectManager.unregisterGameObject(this.scene, this);

    if (this.cardView) {
      this.cardView.destroy();
      this.cardView = null;
    }
  }

  public get combatant(): CombatantView | null {
    return this.cardView;
  }
}

export default ZoneSlotView;