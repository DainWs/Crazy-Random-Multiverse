import { describe, expect, it } from 'vitest';
import * as Constants from '@/core/Constants';

const MINIMUM_FONT_SIZE = 18;

// VIEW-41
describe('Text sizes', () => {
  it.each([
    { name: 'HUD_FONT_SIZE', size: Constants.HUD_FONT_SIZE },
    { name: 'TURN_NOTICE_FONT_SIZE', size: Constants.TURN_NOTICE_FONT_SIZE },
    { name: 'REJECTION_MESSAGE_FONT_SIZE', size: Constants.REJECTION_MESSAGE_FONT_SIZE },
    { name: 'GAME_RESULT_TITLE_FONT_SIZE', size: Constants.GAME_RESULT_TITLE_FONT_SIZE },
    { name: 'GAME_RESULT_DETAIL_FONT_SIZE', size: Constants.GAME_RESULT_DETAIL_FONT_SIZE }
  ])('keeps $name at 18 px or more', ({ size }) => {
    expect(Number.parseInt(size, 10)).toBeGreaterThanOrEqual(MINIMUM_FONT_SIZE);
  });
});
