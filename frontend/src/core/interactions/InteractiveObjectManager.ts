import CardInputManager from "@/core/interactions/CardInputManager";
import { CardView } from "@/game/cards/CardView";
import ZoneSlotView from "@/game/ZoneSlotView";

type GameObject = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Depth;
type InteractiveGameObject = ZoneSlotView | CardView;
type InteractiveGameObjectType = 'ZoneSlotView' | 'CardView';

const NoneFilter = () => true;

const typeFilters = new Map<InteractiveGameObjectType, (object: InteractiveGameObject) => boolean>();
typeFilters.set('ZoneSlotView', (object) => object instanceof ZoneSlotView);
typeFilters.set('CardView', (object) => object instanceof CardView);

const interactableObjects = new Set<InteractiveGameObject>();

function registerGameObject(scene: Phaser.Scene, gameObject: InteractiveGameObject): void {
  interactableObjects.add(gameObject);

  if (gameObject instanceof CardView) {
    CardInputManager.handleCardInputs(scene, gameObject);
  }
}

function unregisterGameObject(scene: Phaser.Scene, gameObject: InteractiveGameObject): void {
  interactableObjects.delete(gameObject);

  if (gameObject instanceof CardView) {
    CardInputManager.removeHandledCard(scene, gameObject);
  }
}

function getTopGameObjectAtCursor<T extends GameObject = InteractiveGameObject>(
  scene: Phaser.Scene,
  onlyOfType?: InteractiveGameObjectType
) {
  const objects = getGameObjectsAtCursor<T>(scene, onlyOfType);
  
  return objects.find(object => 
    objects.every(other => object.depth >= other.depth));
}

function getGameObjectsAtCursor<T extends GameObject = InteractiveGameObject>(
  scene: Phaser.Scene,
  onlyOfType?: InteractiveGameObjectType
) {
  let objectsToCheck = [...interactableObjects];
  if (onlyOfType) {
    const filterFunction = typeFilters.get(onlyOfType) ?? NoneFilter;
    objectsToCheck = objectsToCheck.filter(filterFunction);
  }

  const pointer = scene.input.activePointer;
  const camera = scene.cameras.main;
  const results: InteractiveGameObject[] = [];

  scene.input.manager.hitTest(pointer, [...objectsToCheck], camera, results);
  return results.filter(isAInteractiveGameObject) as unknown as T[];
}

function isAInteractiveGameObject(gameObject: Phaser.GameObjects.GameObject) {
  return (
    gameObject instanceof ZoneSlotView ||
    gameObject instanceof CardView
  );
}

const InteractiveObjectManager = {
  registerGameObject,
  unregisterGameObject
}

export { getGameObjectsAtCursor, getTopGameObjectAtCursor }
export default InteractiveObjectManager;
export type { InteractiveGameObject };