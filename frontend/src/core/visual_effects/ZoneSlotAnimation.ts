import ZoneSlotView from "@/game/zone/ZoneSlotView";
import EffectSettings from "@/core/EffectSettings";
import { SLOT_SOLID_FILL_ALPHA } from "@/core/Constants";
import { paletteFill } from "@/game/utils/Palette";

type ZoneSlotAnimation = 'highlight_as_source' | 'highlight_as_target' | 'unhighlight';
type ZoneSlotAnimationProvider = (zoneSlot: ZoneSlotView) => void;

function noneAnimation() {};

function highlightAsSource(zoneSlot: ZoneSlotView): void {
  zoneSlot.setBackgroundColor(paletteFill('SLOT_SOURCE_FILL'));
  zoneSlot.showMarker(paletteFill('MARK_SOURCE'), EffectSettings.extraMarksAreOn());
}

function highlightAsTarget(zoneSlot: ZoneSlotView): void {
  if (EffectSettings.extraMarksAreOn()) {
    zoneSlot.setBackgroundColor(paletteFill('MARK_VALID'), undefined, SLOT_SOLID_FILL_ALPHA);
  } else {
    zoneSlot.setBackgroundColor(paletteFill('SLOT_VALID_FILL'));
  }

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