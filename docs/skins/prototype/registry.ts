// Reference only, not production code: every skin of docs/skins, by the name of its folder.
import type { Skin } from './kit';
import fantasyHud from '../fantasy/hud';
import fantasyField from '../fantasy/battlefield';
import parchmentHud from '../parchment/hud';
import parchmentField from '../parchment/battlefield';
import neonHud from '../neon/hud';
import neonField from '../neon/battlefield';
import sciFiHud from '../sci-fi/hud';
import sciFiField from '../sci-fi/battlefield';
import arcadeHud from '../arcade-blocks/hud';
import arcadeField from '../arcade-blocks/battlefield';
import woodHud from '../wood/hud';
import woodField from '../wood/battlefield';

export const SKINS: Record<string, Skin> = {
    fantasy: { hud: fantasyHud, battlefield: fantasyField },
    parchment: { hud: parchmentHud, battlefield: parchmentField },
    neon: { hud: neonHud, battlefield: neonField },
    'sci-fi': { hud: sciFiHud, battlefield: sciFiField },
    'arcade-blocks': { hud: arcadeHud, battlefield: arcadeField },
    wood: { hud: woodHud, battlefield: woodField }
};

/** The skin chosen for one element with `window.__hudSkin` or `window.__battlefieldSkin`. */
export function chosen(element: 'hud' | 'battlefield'): Skin | undefined {
    const w = window as unknown as { __hudSkin?: string; __battlefieldSkin?: string };
    const name = element === 'hud' ? w.__hudSkin : w.__battlefieldSkin;
    return name ? SKINS[name] : undefined;
}
