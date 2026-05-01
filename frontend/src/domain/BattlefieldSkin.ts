type BattlefieldType = 'table' | '2v2';

interface BattlefieldSkin {
  name: string;
  battlefieldType: BattlefieldType;
  backgroundColor: number;
  backgroundAlpha: number;
  borderColor: number;
  borderAlpha: number;
  gridColor: number;
  gridAlpha: number;
  thickness: number;
  gridStep: number;
}

const BATTLEFIELD_SKINS: Record<string, BattlefieldSkin> = {
  classic: {
    name: 'Classic',
    battlefieldType: 'table',
    backgroundColor: 0x1a1a2e,
    backgroundAlpha: 0.85,
    borderColor: 0x4488cc,
    borderAlpha: 0.8,
    gridColor: 0x3355aa,
    gridAlpha: 0.65,
    thickness: 80,
    gridStep: 100
  },
  emerald: {
    name: 'Emerald City',
    battlefieldType: 'table',
    backgroundColor: 0x062c1e,
    backgroundAlpha: 1,
    borderColor: 0x2ecc71,
    borderAlpha: 0.6,
    gridColor: 0x27ae60,
    gridAlpha: 0.2,
    thickness: 60,
    gridStep: 80
  },
  lava: {
    name: 'Volcanic',
    battlefieldType: 'table',
    backgroundColor: 0x2c0606,
    backgroundAlpha: 1,
    borderColor: 0xe67e22,
    borderAlpha: 0.7,
    gridColor: 0xc0392b,
    gridAlpha: 0.3,
    thickness: 100,
    gridStep: 120
  }
};

const DEFAULT_SKIN = BATTLEFIELD_SKINS.classic;

export { BATTLEFIELD_SKINS, DEFAULT_SKIN }
export default BattlefieldSkin;