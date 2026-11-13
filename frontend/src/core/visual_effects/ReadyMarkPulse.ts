import { SLOT_MARKER_READY_MIN_ALPHA, SLOT_MARKER_READY_PULSE_PERIOD_MS } from "@/core/Constants";

/**
 * Alpha of the frame of an own card that can attack (VIEW-17). It depends only on the clock of the scene, so a frame
 * created when the board is drawn again continues the pulse in phase instead of restarting it.
 */
function readyMarkAlpha(timeMs: number): number {
  return SLOT_MARKER_READY_MIN_ALPHA + (1 - SLOT_MARKER_READY_MIN_ALPHA) * pulseWave(timeMs, SLOT_MARKER_READY_PULSE_PERIOD_MS);
}

/** A wave between 0 and 1 that repeats every `periodMs` and depends only on the clock, so every pulse that uses it stays in phase. */
function pulseWave(timeMs: number, periodMs: number): number {
  const phase = (timeMs % periodMs) / periodMs;

  return (1 + Math.sin(2 * Math.PI * phase)) / 2;
}

/** The pulse stays at full alpha for who asks for less motion (VIEW-17). */
function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export { prefersReducedMotion, pulseWave, readyMarkAlpha };
