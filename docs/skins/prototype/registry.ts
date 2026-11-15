// Reference only, not production code: the skins of each element by the name of its folder, and the one chosen for each element.
import type { BattlefieldSkin, HudSkin } from './kit';
import fantasy from '../huds/fantasy/hud';
import parchment from '../huds/parchment/hud';
import neon from '../huds/neon/hud';
import sciFi from '../huds/sci-fi/hud';
import arcadeBlocks from '../huds/arcade-blocks/hud';
import wood from '../huds/wood/hud';
import beach from '../battlefields/beach/battlefield';
import castleMoat from '../battlefields/castle-moat/battlefield';
import desert from '../battlefields/desert/battlefield';
import skyIsland from '../battlefields/sky-island/battlefield';
import snow from '../battlefields/snow/battlefield';
import volcano from '../battlefields/volcano/battlefield';
import arcaneAltar from '../battlefields/arcane-altar/battlefield';
import crypt from '../battlefields/crypt/battlefield';
import throneHall from '../battlefields/throne-hall/battlefield';
import circuitBoard from '../battlefields/circuit-board/battlefield';
import danceFloor from '../battlefields/dance-floor/battlefield';
import hexagons from '../battlefields/hexagons/battlefield';
import starChart from '../battlefields/star-chart/battlefield';
import commandBridge from '../battlefields/command-bridge/battlefield';
import spaceHangar from '../battlefields/space-hangar/battlefield';
import dojo from '../battlefields/dojo/battlefield';
import riverRaft from '../battlefields/river-raft/battlefield';
import tavernTable from '../battlefields/tavern-table/battlefield';

export const HUDS: Record<string, HudSkin> = {
    fantasy,
    parchment,
    neon,
    'sci-fi': sciFi,
    'arcade-blocks': arcadeBlocks,
    wood
};

export const BATTLEFIELDS: Record<string, BattlefieldSkin> = {
    'beach': beach,
    'castle-moat': castleMoat,
    'desert': desert,
    'sky-island': skyIsland,
    'snow': snow,
    'volcano': volcano,
    'arcane-altar': arcaneAltar,
    'crypt': crypt,
    'throne-hall': throneHall,
    'circuit-board': circuitBoard,
    'dance-floor': danceFloor,
    'hexagons': hexagons,
    'star-chart': starChart,
    'command-bridge': commandBridge,
    'space-hangar': spaceHangar,
    'dojo': dojo,
    'river-raft': riverRaft,
    'tavern-table': tavernTable
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
