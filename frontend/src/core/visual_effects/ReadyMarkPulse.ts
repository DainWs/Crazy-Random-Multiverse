import { SLOT_MARKER_READY_MIN_ALPHA, SLOT_MARKER_READY_PULSE_PERIOD_MS } from "@/core/Constants";

/**
 * Alpha of the frame of an own card that can attack (VIEW-17). It depends only on the clock of the scene, so a frame
 * created when the board is drawn again continues the pulse in phase instead of restarting it.
 */
function readyMarkAlpha(timeMs: number): number {
  const phase = (timeMs % SLOT_MARKER_READY_PULSE_PERIOD_MS) / SLOT_MARKER_READY_PULSE_PERIOD_MS;
  const wave = (1 + Math.sin(2 * Math.PI * phase)) / 2;

  return SLOT_MARKER_READY_MIN_ALPHA + (1 - SLOT_MARKER_READY_MIN_ALPHA) * wave;
}

/** The pulse stays at full alpha for who asks for less motion (VIEW-17). */
function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export { prefersReducedMotion, readyMarkAlpha };
