import { CardAnimation } from "@/core/visual_effects/CardAnimations";
import { CardTween } from "@/core/visual_effects/CardTweens";
import { ZoneSlotAnimations } from "@/core/visual_effects/ZoneSlotAnimation";

type CardVisualEffects =  CardAnimation | CardTween;
type ZoneSlotVisualEffects = ZoneSlotAnimations;

export type { CardVisualEffects, ZoneSlotVisualEffects };