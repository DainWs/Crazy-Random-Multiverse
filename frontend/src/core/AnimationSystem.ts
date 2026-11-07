import { isDevelopment } from '@/env';

/** Plays one animation and resolves when it ends. */
type AnimationStep = () => Promise<void>;

const steps: AnimationStep[] = [];
let playing = false;

/** Queues an animation to play after the ones already queued, in the order of the events (CON-12). */
function enqueue(step: AnimationStep): void {
  steps.push(step);

  if (!playing) {
    void playAll();
  }
}

/** Whether an animation is playing or waiting, so gameplay stays closed meanwhile (UI-4). */
function isPlaying(): boolean {
  return playing;
}

/** Drops the waiting animations, because the game they belong to is gone. */
function clear(): void {
  steps.length = 0;
}

async function playAll(): Promise<void> {
  playing = true;

  while (steps.length > 0) {
    await play(steps.shift()!);
  }

  playing = false;
}

/** A failed animation must not freeze the rest of the queue, so it is traced and the next one plays. */
async function play(step: AnimationStep): Promise<void> {
  try {
    await step();
  } catch (error) {
    if (isDevelopment) {
      console.error('[AnimationSystem] Error in animation step:', error);
    }
  }
}

const AnimationSystem = {
  enqueue,
  isPlaying,
  clear
};

export type { AnimationStep };
export default AnimationSystem;
