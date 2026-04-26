interface BattlefieldSkin {
    name: string;
    boardColor: number;
    boardAlpha: number;
    borderColor: number;
    borderAlpha: number;
    gridColor: number;
    gridAlpha: number;
    thickness: number;
    legHeight: number;
    gridStep: number;
}

const BATTLEFIELD_SKINS: Record<string, BattlefieldSkin> = {
    cyberpunk: {
        name: 'Cyberpunk',
        boardColor: 0x1a1a2e,
        boardAlpha: 0.85,
        borderColor: 0x4488cc,
        borderAlpha: 0.5,
        gridColor: 0x3355aa,
        gridAlpha: 0.15,
        thickness: 80,
        legHeight: 300,
        gridStep: 100
    },
    emerald: {
        name: 'Emerald City',
        boardColor: 0x062c1e,
        boardAlpha: 0.9,
        borderColor: 0x2ecc71,
        borderAlpha: 0.6,
        gridColor: 0x27ae60,
        gridAlpha: 0.2,
        thickness: 60,
        legHeight: 400,
        gridStep: 80
    },
    lava: {
        name: 'Volcanic',
        boardColor: 0x2c0606,
        boardAlpha: 0.95,
        borderColor: 0xe67e22,
        borderAlpha: 0.7,
        gridColor: 0xc0392b,
        gridAlpha: 0.3,
        thickness: 100,
        legHeight: 200,
        gridStep: 120
    }
};

const DEFAULT_SKIN = BATTLEFIELD_SKINS.cyberpunk;

export { BATTLEFIELD_SKINS, DEFAULT_SKIN }
export type { BattlefieldSkin }