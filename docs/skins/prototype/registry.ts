// Reference only, not production code: the skins of each element by the name of its folder, and the one chosen for each element.
import type { BattlefieldSkin, HudSkin } from './kit';
import fantasy from '../huds/fantasy/hud';
import parchment from '../huds/parchment/hud';
import neon from '../huds/neon/hud';
import sciFi from '../huds/sci-fi/hud';
import arcadeBlocks from '../huds/arcade-blocks/hud';
import wood from '../huds/wood/hud';
import arcadeBlocksBeach from '../battlefields/arcade-blocks-beach/battlefield';
import arcadeBlocksCastle from '../battlefields/arcade-blocks-castle/battlefield';
import arcadeBlocksDesert from '../battlefields/arcade-blocks-desert/battlefield';
import arcadeBlocksSkyIsland from '../battlefields/arcade-blocks-sky-island/battlefield';
import arcadeBlocksSnow from '../battlefields/arcade-blocks-snow/battlefield';
import arcadeBlocksVolcano from '../battlefields/arcade-blocks-volcano/battlefield';
import fantasyArcaneAltar from '../battlefields/fantasy-arcane-altar/battlefield';
import fantasyCrypt from '../battlefields/fantasy-crypt/battlefield';
import fantasyThroneHall from '../battlefields/fantasy-throne-hall/battlefield';
import neonCircuitBoard from '../battlefields/neon-circuit-board/battlefield';
import neonDanceFloor from '../battlefields/neon-dance-floor/battlefield';
import neonHexagons from '../battlefields/neon-hexagons/battlefield';
import parchmentStarChart from '../battlefields/parchment-star-chart/battlefield';
import sciFiCommandBridge from '../battlefields/sci-fi-command-bridge/battlefield';
import sciFiSpaceHangar from '../battlefields/sci-fi-space-hangar/battlefield';
import woodDojo from '../battlefields/wood-dojo/battlefield';
import woodRiverRaft from '../battlefields/wood-river-raft/battlefield';
import woodTavernTable from '../battlefields/wood-tavern-table/battlefield';

export const HUDS: Record<string, HudSkin> = {
    fantasy,
    parchment,
    neon,
    'sci-fi': sciFi,
    'arcade-blocks': arcadeBlocks,
    wood
};

export const BATTLEFIELDS: Record<string, BattlefieldSkin> = {
    'arcade-blocks-beach': arcadeBlocksBeach,
    'arcade-blocks-castle': arcadeBlocksCastle,
    'arcade-blocks-desert': arcadeBlocksDesert,
    'arcade-blocks-sky-island': arcadeBlocksSkyIsland,
    'arcade-blocks-snow': arcadeBlocksSnow,
    'arcade-blocks-volcano': arcadeBlocksVolcano,
    'fantasy-arcane-altar': fantasyArcaneAltar,
    'fantasy-crypt': fantasyCrypt,
    'fantasy-throne-hall': fantasyThroneHall,
    'neon-circuit-board': neonCircuitBoard,
    'neon-dance-floor': neonDanceFloor,
    'neon-hexagons': neonHexagons,
    'parchment-star-chart': parchmentStarChart,
    'sci-fi-command-bridge': sciFiCommandBridge,
    'sci-fi-space-hangar': sciFiSpaceHangar,
    'wood-dojo': woodDojo,
    'wood-river-raft': woodRiverRaft,
    'wood-tavern-table': woodTavernTable
};

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
