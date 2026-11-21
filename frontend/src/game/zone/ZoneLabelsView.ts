import type { PlayerCode } from '@/domain/Player';
import type { Size2D } from '@/domain/Geometry';
import type { Strip, ZoneBounds } from '@/game/zone/ZoneLabelLayout';
import type { LabelSide } from '@/game/zone/CardValueLabelLayout';
import type { PaletteColor } from '@/game/utils/Palette';
import type ZoneView from '@/game/zone/ZoneView';
import Phaser from 'phaser';
import StoreSystem from '@/core/StoreSystem';
import * as Constants from '@/core/Constants';
import { getText } from '@/core/Texts';
import { createPanel, createText } from '@/game/hud/HudPieces';
import { paletteFill } from '@/game/utils/Palette';
import CardValueLabelLayout from '@/game/zone/CardValueLabelLayout';
import ZoneLabelLayout from '@/game/zone/ZoneLabelLayout';

interface ZoneBar {
  back: Phaser.GameObjects.Rectangle;
  fill: Phaser.GameObjects.Rectangle;
  ratio: number;
}

interface ZoneEntry {
  bounds: ZoneBounds;
  side: LabelSide;
  name: Phaser.GameObjects.Container;
  /** Size in px on the screen, which does not change with the zoom. */
  nameSize: Size2D;
  bar?: ZoneBar;
}

/** The name of each zone, the health bar of its leader and the mark of who plays next, around the zones of the board (VIEW-49, VIEW-50, VIEW-51). */
class ZoneLabelsView extends Phaser.GameObjects.Container {
  private readonly layout = new ZoneLabelLayout();
  private readonly cardLayout = new CardValueLabelLayout();
  private readonly entries: ZoneEntry[];
  private unitsPerPixel = 1;

  /** `showBars` is false while the leaders are being placed at the start, so a bar does not wait for a card that is not there yet (VIEW-12). */
  public constructor(scene: Phaser.Scene, zoneViews: ZoneView[], playerWithTurn: PlayerCode | undefined, showBars: boolean) {
    super(scene, 0, 0);

    const nextCode = this.layout.nextPlayerCode(this.turnOrder(zoneViews), playerWithTurn);
    this.entries = zoneViews.map((zoneView) => this.createEntry(zoneView, zoneView.zone.owner.code === nextCode, showBars));
  }

  /** The labels and the thickness of the bars keep their size on the screen at any zoom, so they are scaled against it (VIEW-49, VIEW-50). */
  public applyScale(unitsPerPixel: number) {
    this.unitsPerPixel = unitsPerPixel;

    for (const entry of this.entries) {
      entry.name.setScale(unitsPerPixel);
      const center = this.layout.name(entry.bounds, entry.side, entry.nameSize, unitsPerPixel);
      entry.name.setPosition(center.x, center.y);

      if (entry.bar) {
        this.placeBar(entry.bar, entry, unitsPerPixel);
      }
    }
  }

  public getUnitsPerPixel(): number {
    return this.unitsPerPixel;
  }

  /** The zones are in turn order in the state of the game, which does not change, and who is alive is read from the board being shown (UI-3, TURN-1). */
  private turnOrder(zoneViews: ZoneView[]) {
    const shownByCode = new Map(zoneViews.map((zoneView) => [zoneView.zone.owner.code, zoneView.zone]));

    return StoreSystem.getZones().map((zone) => ({ code: zone.owner.code, isAlive: shownByCode.get(zone.owner.code)?.owner.isAlive ?? false }));
  }

  private createEntry(zoneView: ZoneView, isNext: boolean, showBars: boolean): ZoneEntry {
    const corners = zoneView.getSlots().flat().flatMap((slotView) => {
      const { tl, tr, bl, br } = slotView.corners;
      return [tl, tr, bl, br].map((corner) => ({ x: zoneView.x + slotView.x + corner.x, y: zoneView.y + slotView.y + corner.y }));
    });
    const leaderSlot = zoneView.getSlots().flat().find((slotView) => slotView.zoneSlot.allowedCombatant === 'LEADER')!;
    const side = this.cardLayout.sideOf(this.cardLayout.edgeOffset(leaderSlot.corners));
    const { label, size } = this.createName(zoneView, isNext);
    const entry: ZoneEntry = { bounds: this.layout.boundsOf(corners), side, name: label, nameSize: size };

    const leader = leaderSlot.zoneSlot.combatant;
    if (showBars && zoneView.zone.owner.isAlive && leader?.health) {
      entry.bar = this.createBar(leader.health.value / (leader.health.maxValue ?? leader.health.value));
    }

    this.add(label);
    return entry;
  }

  private createName(zoneView: ZoneView, isNext: boolean) {
    const owner = zoneView.zone.owner;
    const isLocal = owner.code === StoreSystem.getPlayer().code;
    const color: PaletteColor = isNext ? 'ZONE_NEXT_LABEL' : 'HUD_TEXT';
    const mark = isNext ? Constants.ZONE_NEXT_MARK : '';
    const text = createText(this.scene, 'LABEL', { color });
    const padding = Constants.ZONE_LABEL_PADDING;

    const measure = (candidate: string) => {
      text.setText(`${mark}${candidate}`);
      return text.width + 2 * padding;
    };
    const name = this.layout.truncateName(isLocal ? getText('ui.game.you') : owner.name, Constants.ZONE_NAME_MAX_WIDTH, measure);
    text.setText(`${mark}${name}`);
    text.setOrigin(0.5, 0.5);

    const size = { width: text.width + 2 * padding, height: text.height + 2 * padding };
    const panel = createPanel(this.scene, 'HUD');
    panel.setSize(size.width, size.height);

    return { label: this.scene.add.container(0, 0, [panel, text]), size };
  }

  private createBar(ratio: number): ZoneBar {
    const back = this.scene.add.rectangle(0, 0, 0, 0, paletteFill('ZONE_BAR_BACK'));
    const fill = this.scene.add.rectangle(0, 0, 0, 0, paletteFill('ZONE_BAR_FILL'));
    this.add([back, fill]);

    return { back, fill, ratio };
  }

  private placeBar(bar: ZoneBar, entry: ZoneEntry, unitsPerPixel: number) {
    const back: Strip = this.layout.bar(entry.bounds, entry.side, unitsPerPixel);
    const fill: Strip = this.layout.fill(back, bar.ratio);

    bar.back.setPosition(back.center.x, back.center.y).setSize(back.size.width, back.size.height);
    bar.back.setStrokeStyle(Constants.ZONE_BAR_BORDER_WIDTH * unitsPerPixel, paletteFill('ZONE_BAR_BORDER'));
    bar.fill.setPosition(fill.center.x, fill.center.y).setSize(fill.size.width, fill.size.height);
  }
}

export default ZoneLabelsView;
