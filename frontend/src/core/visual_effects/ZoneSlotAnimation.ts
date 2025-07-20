import ZoneSlotView from "@/game/ZoneSlotView";

type ZoneSlotAnimation = 'highlight_as_source' | 'highlight_as_target' | 'unhighlight';
type ZoneSlotAnimationProvider = (zoneSlot: ZoneSlotView) => void;

function noneAnimation() {};

function highlightAsSource(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(0xD40000);
}

function highlightAsTarget(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(0xAAFFAA);
}

function unhighlight(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(0xffffff);
}

const animations = new Map<ZoneSlotAnimation, ZoneSlotAnimationProvider>();
animations.set('highlight_as_source', highlightAsSource);
animations.set('highlight_as_target', highlightAsTarget);
animations.set('unhighlight', unhighlight);

const applyAnimation = (zoneSlot: ZoneSlotView, animation: ZoneSlotAnimation) => {
  const apply = animations.get(animation) ?? noneAnimation;
  apply(zoneSlot);
}

export type { ZoneSlotAnimation, ZoneSlotAnimation as ZoneSlotAnimations };
export default applyAnimation;