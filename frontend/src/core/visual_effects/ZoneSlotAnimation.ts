import ZoneSlotView from "@/game/zone/ZoneSlotView";
import { SLOT_MARKER_SOURCE_COLOR, SLOT_MARKER_VALID_COLOR } from "@/core/Constants";

type ZoneSlotAnimation = 'highlight_as_source' | 'highlight_as_target' | 'unhighlight';
type ZoneSlotAnimationProvider = (zoneSlot: ZoneSlotView) => void;

function noneAnimation() {};

function highlightAsSource(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(0xD40000);
  zoneSlot.showMarker(SLOT_MARKER_SOURCE_COLOR);
}

function highlightAsTarget(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(0xAAFFAA);
  zoneSlot.showMarker(SLOT_MARKER_VALID_COLOR);
}

function unhighlight(zoneSlot: ZoneSlotView): void {
  zoneSlot.restoreBackground();
  zoneSlot.hideMarker();
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