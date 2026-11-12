import type { PlayerCode } from "@/domain/Player";
import Battlefield, { BattlefieldSide } from "@/domain/Battlefield";
import { Rotation, Size2D } from "@/domain/Geometry";
import ZoneView, { BASE_SLOT_SPACING } from "@/game/zone/ZoneView";
import { CARD_SIZE } from "@/game/cards/CardDimensions";
import { GameScene } from "@/scenes/Game";
import ZoneLayout from "@/game/zone/ZoneLayout";

const ROTATION_MAP = new Map<BattlefieldSide, Rotation>();
ROTATION_MAP.set(BattlefieldSide.BOTTOM, 0);
ROTATION_MAP.set(BattlefieldSide.TOP, 180);
ROTATION_MAP.set(BattlefieldSide.LEFT, 90);
ROTATION_MAP.set(BattlefieldSide.RIGHT, -90);

const FRIENDLY_SIDE = BattlefieldSide.BOTTOM;
const FRIENDLY_ROTATION = ROTATION_MAP.get(FRIENDLY_SIDE)!;
const ENEMY_SIDE_ITERATOR = [BattlefieldSide.TOP, BattlefieldSide.LEFT, BattlefieldSide.RIGHT];

type ZoneSizing = { slotSize: Size2D; spaceBetweenSlots: number };

function createZoneSizing(zoneScale: number): ZoneSizing {
  return {
    slotSize: { width: CARD_SIZE.width * zoneScale, height: CARD_SIZE.height * zoneScale },
    spaceBetweenSlots: BASE_SLOT_SPACING * zoneScale
  };
}

function createAllZoneViews(scene: GameScene, battlefield: Battlefield, playerWithTurn?: PlayerCode) {
  const mainPlayerIndex = Math.floor(battlefield.getMaxPlayersPerSide() / 2);
  const layout = new ZoneLayout(battlefield, ENEMY_SIDE_ITERATOR);
  const zoneSizing = createZoneSizing(layout.getZoneScale());

  return [
    createMyZoneView(scene, battlefield, layout, zoneSizing, mainPlayerIndex, playerWithTurn),
    ...createFriendlyZoneViews(scene, battlefield, layout, zoneSizing, mainPlayerIndex, playerWithTurn),
    ...createEnemyZoneViews(scene, battlefield, layout, zoneSizing, playerWithTurn)
  ];
}

function createMyZoneView(scene: GameScene, battlefield: Battlefield, layout: ZoneLayout, zoneSizing: ZoneSizing, mainPlayerIndex: number, playerWithTurn?: PlayerCode) {
  const zoneView = new ZoneView(scene, battlefield.myZone,  {
    position: layout.getPlayerZonePosition(FRIENDLY_SIDE, mainPlayerIndex, mainPlayerIndex),
    rotation: FRIENDLY_ROTATION,
    ...zoneSizing,
    hasTurn: battlefield.myZone.owner.code === playerWithTurn
  });

  return zoneView;
}

function createFriendlyZoneViews(scene: GameScene, battlefield: Battlefield, layout: ZoneLayout, zoneSizing: ZoneSizing, mainPlayerIndex: number, playerWithTurn?: PlayerCode) {
  const friendlyZoneViews: ZoneView[] = [];

  for (let index = 0; index < battlefield.friendlyZones.length; index++) {
    const friendlyZone = battlefield.friendlyZones[index];
    const zoneView = new ZoneView(scene, friendlyZone,  {
      position: layout.getNextBottomZonePosition(index, mainPlayerIndex),
      rotation: FRIENDLY_ROTATION,
      ...zoneSizing,
      hasTurn: friendlyZone.owner.code === playerWithTurn
    });
    friendlyZoneViews.push(zoneView);
  }

  return friendlyZoneViews;
}

function createEnemyZoneViews(scene: GameScene, battlefield: Battlefield, layout: ZoneLayout, zoneSizing: ZoneSizing, playerWithTurn?: PlayerCode) {
  const enemyZoneViews: ZoneView[] = [];

  for (let index = 0; index < battlefield.enemyZones.length; index++) {
    const enemyZone = battlefield.enemyZones[index];
    const side = ENEMY_SIDE_ITERATOR[index % ENEMY_SIDE_ITERATOR.length];

    const zoneView = new ZoneView(scene, enemyZone,  {
      position: layout.getNextEnemyZonePosition(index),
      rotation: ROTATION_MAP.get(side)!,
      ...zoneSizing,
      hasTurn: enemyZone.owner.code === playerWithTurn
    });
    enemyZoneViews.push(zoneView);
  }

  return enemyZoneViews;
}

const ZoneViewFactory = {
  createAllZoneViews
};

export default ZoneViewFactory;