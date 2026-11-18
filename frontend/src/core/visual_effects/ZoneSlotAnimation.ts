import ZoneSlotView from "@/game/zone/ZoneSlotView";
import { paletteFill } from "@/game/utils/Palette";

type ZoneSlotAnimation = 'highlight_as_source' | 'highlight_as_target' | 'unhighlight';
type ZoneSlotAnimationProvider = (zoneSlot: ZoneSlotView) => void;

function noneAnimation() {};

function highlightAsSource(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(paletteFill('SLOT_SOURCE_FILL'));
  zoneSlot.showMarker(paletteFill('MARK_SOURCE'));
}

function highlightAsTarget(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(paletteFill('SLOT_VALID_FILL'));
  zoneSlot.showMarker(paletteFill('MARK_VALID'));
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