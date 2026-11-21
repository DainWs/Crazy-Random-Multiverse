import { describe, expect, it } from 'vitest';
import * as Constants from '@/core/Constants';

const MINIMUM_FONT_SIZE = 18;

// VIEW-41
describe('Text sizes', () => {
  it.each([
    { name: 'TEXT_SIZE_TITLE', size: Constants.TEXT_SIZE_TITLE },
    { name: 'TEXT_SIZE_BODY', size: Constants.TEXT_SIZE_BODY },
    { name: 'TEXT_SIZE_LABEL', size: Constants.TEXT_SIZE_LABEL },
    { name: 'TEXT_SIZE_NUMBERS', size: Constants.TEXT_SIZE_NUMBERS }
  ])('keeps $name at 18 px or more', ({ size }) => {
    expect(Number.parseInt(size, 10)).toBeGreaterThanOrEqual(MINIMUM_FONT_SIZE);
  });
});
