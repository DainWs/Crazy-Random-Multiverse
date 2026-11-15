// Reference only, not production code: the skins of each element by the name of its folder, and the one chosen for each element.
import type { BattlefieldSkin, HudSkin } from './kit';
import fantasy from '../huds/fantasy/hud';
import parchment from '../huds/parchment/hud';
import neon from '../huds/neon/hud';
import sciFi from '../huds/sci-fi/hud';
import arcadeBlocks from '../huds/arcade-blocks/hud';
import wood from '../huds/wood/hud';

export const HUDS: Record<string, HudSkin> = {
    fantasy,
    parchment,
    neon,
    'sci-fi': sciFi,
    'arcade-blocks': arcadeBlocks,
    wood
};

export const BATTLEFIELDS: Record<string, BattlefieldSkin> = {};

type Choices = { __hudSkin?: string; __battlefieldSkin?: string };

/** The HUD skin chosen with `window.__hudSkin`; none keeps the HUD of the game. */
export function chosenHud(): HudSkin | undefined {
    const name = (window as unknown as Choices).__hudSkin;
    return name ? HUDS[name] : undefined;
}

/** The battlefield skin chosen with `window.__battlefieldSkin`; none keeps the table of the game. */
export function chosenBattlefield(): BattlefieldSkin | undefined {
    const name = (window as unknown as Choices).__battlefieldSkin;
    return name ? BATTLEFIELDS[name] : undefined;
}
