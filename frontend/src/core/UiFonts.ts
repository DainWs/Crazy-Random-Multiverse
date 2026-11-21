import { TEXT_SIZE_BODY, UI_FONT_FAMILY } from '@/core/Constants';

const UI_FONT_WEIGHTS = ['400', '700'];

/** The canvas draws a text once with the font it has at that moment, so the font of the interface has to be loaded before any scene writes (VIEW-54). A font that fails to load leaves the fallback of its family. */
async function loadUiFonts(): Promise<void> {
  try {
    await Promise.all(UI_FONT_WEIGHTS.map((weight) => document.fonts.load(`${weight} ${TEXT_SIZE_BODY} ${UI_FONT_FAMILY}`)));
  } catch {
    return;
  }
}

export { loadUiFonts };
