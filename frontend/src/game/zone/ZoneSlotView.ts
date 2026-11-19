import Phaser from "phaser";
import applyAnimation from "@/core/visual_effects/ZoneSlotAnimation";
import { pulseWave, readyMarkAlpha } from "@/core/visual_effects/ReadyMarkPulse";
import EffectSettings from "@/core/EffectSettings";
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
  EXTRA_MARK_FRAME_WIDTH,
  HIT_FLASH_DURATION_MS,
  HIT_FLASH_EASE,
  OWN_ZONE_LINE_WIDTH,
  TURN_CROWN_DIAMETER,
  TURN_GLOW_MIN_ALPHA,
  TURN_GLOW_PULSE_PERIOD_MS
} from "@/core/Constants";
import { playMotion } from "@/core/visual_effects/Motion";
import { paletteFill } from "@/game/utils/Palette";
import { ownZoneLines, readyCorners, sourceDashes } from "@/game/zone/SlotMarkLayout";

class ZoneSlotView extends Phaser.GameObjects.Container implements CombatantViewHolder {
  private backgroundGraphics: Phaser.GameObjects.Graphics;
  private mark: Phaser.GameObjects.Image;
  private crownGraphics?: Phaser.GameObjects.Graphics;
  private ownZoneLinesGraphics?: Phaser.GameObjects.Graphics;
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
      this.setBackgroundColor(paletteFill('SLOT_OWN_TINT'), paletteFill('SLOT_OWN_BORDER'));
      this.showOwnZoneLines();
    } else {
      this.setBackgroundColor(paletteFill('SLOT_FILL'));
    }
  }

  /** With the extra marks on, the diagonal lines tell the own zone apart without color, under the cards (VIEW-39). */
  private showOwnZoneLines() {
    if (!EffectSettings.extraMarksAreOn() || this.ownZoneLinesGraphics) {
      return;
    }

    this.ownZoneLinesGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderPaths(
      this.ownZoneLinesGraphics, ownZoneLines(this.corners), paletteFill('SLOT_OWN_BORDER'), OWN_ZONE_LINE_WIDTH
    );
    this.addAt(this.ownZoneLinesGraphics, 1);
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
    this.keepCrownOnTop();

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
    this.keepCrownOnTop();

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
  public async flash(color: number): Promise<void> {
    const flashGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderBackground(flashGraphics, this.corners, color, color);
    this.add(flashGraphics);

    await playMotion(this.scene, {
      targets: flashGraphics,
      to: { alpha: 0 },
      duration: HIT_FLASH_DURATION_MS,
      curve: HIT_FLASH_EASE,
      kind: 'NON_ESSENTIAL'
    });

    flashGraphics.destroy();
  }

  /** Frames this slot, for the player with the turn, over its own border and under its card, with a pulse that follows the clock of the scene (VIEW-20). */
  public showTurnGlow() {
    this.glowGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderMarker(this.glowGraphics, this.corners, paletteFill('MARK_TURN_GLOW'));
    this.add(this.glowGraphics);
    this.showTurnCrown();

    this.turnFramePulses = !EffectSettings.pulsesAreStill();
    this.pulseTurnGlow();
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.pulseTurnGlow, this);
  }

  /** With the extra marks on, a crown at the top of the leader's slot, flat and horizontal on the screen, over its card (VIEW-39). */
  private showTurnCrown() {
    if (!EffectSettings.extraMarksAreOn()) {
      return;
    }

    const world = this.getWorldTransformMatrix();
    this.crownGraphics = this.scene.add.graphics();
    ZoneSlotViewRenderer.renderCrown(this.crownGraphics, TURN_CROWN_DIAMETER / 2);
    this.crownGraphics.setPosition((this.corners.tl.x + this.corners.tr.x) / 2, (this.corners.tl.y + this.corners.tr.y) / 2);
    this.crownGraphics.setRotation(-world.rotation);
    this.crownGraphics.setScale(1 / world.scaleX);
    this.add(this.crownGraphics);
  }

  private keepCrownOnTop() {
    if (this.crownGraphics) {
      this.bringToTop(this.crownGraphics);
    }
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

  /** Frames the slot over its card, with dashes instead of a solid line when `dashed` (UI-5, VIEW-4, VIEW-39). */
  public showMarker(color: number, dashed = false) {
    this.markerGraphics ??= this.scene.add.graphics();

    if (dashed) {
      ZoneSlotViewRenderer.renderPaths(this.markerGraphics, sourceDashes(this.corners), color, EXTRA_MARK_FRAME_WIDTH);
    } else {
      ZoneSlotViewRenderer.renderMarker(this.markerGraphics, this.corners, color);
    }

    this.add(this.markerGraphics);
    this.bringToTop(this.markerGraphics);
  }

  /** Frames an own card that can attack now with a pulse, under the frames of `showMarker` (VIEW-17). */
  public showReadyMark() {
    this.readyGraphics ??= this.scene.add.graphics();

    if (EffectSettings.extraMarksAreOn()) {
      ZoneSlotViewRenderer.renderPaths(
        this.readyGraphics, readyCorners(this.corners), paletteFill('MARK_READY'), EXTRA_MARK_FRAME_WIDTH
      );
    } else {
      ZoneSlotViewRenderer.renderMarker(this.readyGraphics, this.corners, paletteFill('MARK_READY'));
    }

    this.add(this.readyGraphics);
    this.bringToTop(this.readyGraphics);

    if (EffectSettings.pulsesAreStill()) {
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

  public setBackgroundColor(color: number, borderColor?: number, alpha?: number): void {
    ZoneSlotViewRenderer.renderBackground(this.backgroundGraphics, this.corners, color, borderColor, alpha);
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