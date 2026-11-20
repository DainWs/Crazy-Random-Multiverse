/** How much the effects cost: with `LOW`, the non-essential ones are left out (UI-28). */
type EffectQuality = 'NORMAL' | 'LOW';

/** Whether an effect shows what the player needs (`ESSENTIAL`) or only decorates (`NON_ESSENTIAL`) (UI-26). */
type EffectKind = 'ESSENTIAL' | 'NON_ESSENTIAL';

/** The kinds of effect that play. The MVP has no settings, so every kind plays (UI-30). */
const PLAYING_KINDS = new Map<EffectKind, boolean>([
  ['ESSENTIAL', true],
  ['NON_ESSENTIAL', true]
]);

/** Whether an effect of this kind plays. When it does not, whoever asks leaves its final state at once. */
function plays(kind: EffectKind): boolean {
  return PLAYING_KINDS.get(kind) === true;
}

/** The pulses of VIEW-17, VIEW-20 and VIEW-38 stay still for who asks the operating system for less motion (UI-30). */
function pulsesAreStill(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/** Names and value of the address parameters that turn on the accessible mode and the second signal of the marks (UI-31). */
const ACCESSIBLE_PARAMETER = 'accessible';
const EXTRA_MARKS_PARAMETER = 'extraMarks';
const PARAMETER_ON_VALUE = '1';

function isParameterOn(name: string): boolean {
  return new URLSearchParams(window.location.search).get(name) === PARAMETER_ON_VALUE;
}

/** Whether the page was opened with `accessible=1`; any other value, or none, is the base game (UI-31). */
function accessibleModeIsOn(): boolean {
  return isParameterOn(ACCESSIBLE_PARAMETER);
}

/** Whether the extra signals of the marks are on: with `extraMarks=1` or in the accessible mode (UI-31). */
function extraMarksAreOn(): boolean {
  return isParameterOn(EXTRA_MARKS_PARAMETER) || accessibleModeIsOn();
}

const EffectSettings = {
  /** Fixed in the MVP (UI-30). */
  quality: 'NORMAL' as EffectQuality,
  /** Fixed in the MVP, and not what the operating system asks (UI-30). */
  reducedMotion: false,
  plays,
  pulsesAreStill,
  accessibleModeIsOn,
  extraMarksAreOn
};

export type { EffectKind, EffectQuality };
export default EffectSettings;
