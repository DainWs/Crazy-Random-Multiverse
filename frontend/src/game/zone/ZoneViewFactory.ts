import Battlefield, { BattlefieldSide } from "@/domain/Battlefield";
import { Rotation } from "@/domain/Geometry";
import ZoneView from "@/game/zone/ZoneView";
import CardView from "@/game/cards/CardView";
import { GameScene } from "@/scenes/Game";
import ZoneLayout from "@/game/zone/ZoneLayout";

const ROTATION_MAP = new Map<BattlefieldSide, Rotation>();
ROTATION_MAP.set(BattlefieldSide.BOTTOM, 0);
ROTATION_MAP.set(BattlefieldSide.TOP, 180);
ROTATION_MAP.set(BattlefieldSide.LEFT, 90);
ROTATION_MAP.set(BattlefieldSide.RIGHT, -90);

const SLOT_SIZE = CardView.SIZE;
const FRIENDLY_SIDE = BattlefieldSide.BOTTOM;
const FRIENDLY_ROTATION = ROTATION_MAP.get(FRIENDLY_SIDE)!;
const ENEMY_SIDE_ITERATOR = [BattlefieldSide.TOP, BattlefieldSide.LEFT, BattlefieldSide.RIGHT];

function createAllZoneViews(scene: GameScene, battlefield: Battlefield) {
  const mainPlayerIndex = Math.floor(battlefield.maxPlayersPerSide / 2);
  const layout = new ZoneLayout(battlefield, ENEMY_SIDE_ITERATOR);

  return [
    createMyZoneView(scene, battlefield, layout, mainPlayerIndex),
    ...createFriendlyZoneViews(scene, battlefield, layout, mainPlayerIndex),
    ...createEnemyZoneViews(scene, battlefield, layout)
  ];
}

function createMyZoneView(scene: GameScene, battlefield: Battlefield, layout: ZoneLayout, mainPlayerIndex: number) {
  const zoneView = new ZoneView(scene, battlefield.myZone,  {
    position: layout.getPlayerZonePosition(FRIENDLY_SIDE, mainPlayerIndex, mainPlayerIndex),
    rotation: FRIENDLY_ROTATION,
    slotSize: SLOT_SIZE
  });

  return zoneView;
}

function createFriendlyZoneViews(scene: GameScene, battlefield: Battlefield, layout: ZoneLayout, mainPlayerIndex: number) {
  const friendlyZoneViews: ZoneView[] = [];

  for (let index = 0; index < battlefield.friendlyZones.length; index++) {
    const friendlyZone = battlefield.friendlyZones[index];
    const zoneView = new ZoneView(scene, friendlyZone,  {
      position: layout.getNextBottomZonePosition(index, mainPlayerIndex),
      rotation: FRIENDLY_ROTATION,
      slotSize: SLOT_SIZE
    });
    friendlyZoneViews.push(zoneView);
  }

  return friendlyZoneViews;
}

function createEnemyZoneViews(scene: GameScene, battlefield: Battlefield, layout: ZoneLayout) {
  const enemyZoneViews: ZoneView[] = [];

  for (let index = 0; index < battlefield.enemyZones.length; index++) {
    const enemyZone = battlefield.enemyZones[index];
    const side = ENEMY_SIDE_ITERATOR[index % ENEMY_SIDE_ITERATOR.length];

    const zoneView = new ZoneView(scene, enemyZone,  {
      position: layout.getNextEnemyZonePosition(index),
      rotation: ROTATION_MAP.get(side)!,
      slotSize: SLOT_SIZE
    });
    enemyZoneViews.push(zoneView);
  }

  return enemyZoneViews;
}

const ZoneViewFactory = {
  createAllZoneViews
};

export default ZoneViewFactory;