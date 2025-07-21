import CardInputManager from "@/core/interactions/CardInputManager";
import { CardView } from "@/game/cards/CardView";
import HandView from "@/game/HandView";
import ZoneSlotView from "@/game/ZoneSlotView";

type GameObject = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Depth;
type InteractiveGameObject = HandView | ZoneSlotView | CardView;
type InteractiveGameObjectType =  'HandView' | 'ZoneSlotView' | 'CardView';

type Predicate = (object: InteractiveGameObject) => boolean;

const NoneFilter = () => true;

const typeFilters = new Map<InteractiveGameObjectType, (object: InteractiveGameObject) => boolean>();
typeFilters.set('ZoneSlotView', (object) => object instanceof ZoneSlotView);
typeFilters.set('HandView', (object) => object instanceof HandView);
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

function getTopGameObjectAtCursor(scene: Phaser.Scene, ...onlyOfType: InteractiveGameObjectType[]) {
  const objects = getGameObjectsAtCursor(scene, ...onlyOfType);

  return objects.find(object => 
    objects.every(other => object.depth >= other.depth));
}

function getGameObjectsAtCursor(scene: Phaser.Scene, ...onlyOfTypes: InteractiveGameObjectType[]) {
  const objects = copyInteractableObjects(onlyOfTypes);

  const pointer = scene.input.activePointer;
  const camera = scene.cameras.main;
  const results: InteractiveGameObject[] = [];
  scene.input.manager.hitTest(pointer, [...objects], camera, results);

  return results.filter(isAInteractiveGameObject) as GameObject[]; // TODO replace this filter with onlyOfType filter
}

function copyInteractableObjects(onlyOfTypes: InteractiveGameObjectType[]) {
  const filters: Predicate[] = [];
  for (const type of onlyOfTypes) {
    filters.push(typeFilters.get(type) ?? NoneFilter);
  } 

  return [...interactableObjects]
    .filter(interactableObject => filters.some(filter => filter(interactableObject)));
}

function isAInteractiveGameObject(gameObject: Phaser.GameObjects.GameObject) {
  return (
    gameObject instanceof HandView ||
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
export type { InteractiveGameObject, InteractiveGameObjectType };