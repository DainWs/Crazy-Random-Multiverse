import type { PaletteColor } from '@/game/utils/Palette';

type BattlefieldType = 'table' | '2v2';

interface BattlefieldSkin {
  name: string;
  battlefieldType: BattlefieldType;
  backgroundColor: PaletteColor;
  backgroundAlpha: number;
  borderColor: PaletteColor;
  borderAlpha: number;
  gridColor: PaletteColor;
  gridAlpha: number;
  thickness: number;
  gridStep: number;
}

const BATTLEFIELD_SKINS: Record<string, BattlefieldSkin> = {
  classic: {
    name: 'Classic',
    battlefieldType: 'table',
    backgroundColor: 'TABLE_CLASSIC_BACKGROUND',
    backgroundAlpha: 0.85,
    borderColor: 'TABLE_CLASSIC_BORDER',
    borderAlpha: 0.8,
    gridColor: 'TABLE_CLASSIC_GRID',
    gridAlpha: 0.3,
    thickness: 80,
    gridStep: 100
  },
  emerald: {
    name: 'Emerald City',
    battlefieldType: 'table',
    backgroundColor: 'TABLE_EMERALD_BACKGROUND',
    backgroundAlpha: 1,
    borderColor: 'TABLE_EMERALD_BORDER',
    borderAlpha: 0.6,
    gridColor: 'TABLE_EMERALD_GRID',
    gridAlpha: 0.2,
    thickness: 60,
    gridStep: 80
  },
  lava: {
    name: 'Volcanic',
    battlefieldType: 'table',
    backgroundColor: 'TABLE_LAVA_BACKGROUND',
    backgroundAlpha: 1,
    borderColor: 'TABLE_LAVA_BORDER',
    borderAlpha: 0.7,
    gridColor: 'TABLE_LAVA_GRID',
    gridAlpha: 0.3,
    thickness: 100,
    gridStep: 120
  }
};

const DEFAULT_SKIN = BATTLEFIELD_SKINS.classic;

export { BATTLEFIELD_SKINS, DEFAULT_SKIN }
export default BattlefieldSkin;