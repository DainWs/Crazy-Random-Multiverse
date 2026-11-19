import { afterEach, describe, expect, it, vi } from 'vitest';
import EffectSettings from '@/core/EffectSettings';
import applyAnimation, { ZoneSlotAnimation } from '@/core/visual_effects/ZoneSlotAnimation';
import ZoneSlotView from '@/game/zone/ZoneSlotView';
import { paletteFill } from '@/game/utils/Palette';

describe('ZoneSlotAnimation', () => {
  const createMockZoneSlot = () => {
    return {
      setBackgroundColor: vi.fn(),
      restoreBackground: vi.fn(),
      showMarker: vi.fn(),
      hideMarker: vi.fn()
    } as unknown as ZoneSlotView;
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets red background color for highlight_as_source', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'highlight_as_source');
    expect(slot.setBackgroundColor).toHaveBeenCalledWith(0xD40000);
  });

  // UI-5, VIEW-4
  it('frames the slot in red for highlight_as_source', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'highlight_as_source');
    expect(slot.showMarker).toHaveBeenCalledWith(paletteFill('MARK_SOURCE'), false);
  });

  it('sets light green background color for highlight_as_target', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'highlight_as_target');
    expect(slot.setBackgroundColor).toHaveBeenCalledWith(0xAAFFAA);
  });

  // UI-5, VIEW-4
  it('frames the slot in green for highlight_as_target', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'highlight_as_target');
    expect(slot.showMarker).toHaveBeenCalledWith(paletteFill('MARK_VALID'));
  });

  it('restores the background of the slot for unhighlight', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'unhighlight');
    expect(slot.restoreBackground).toHaveBeenCalled();
  });

  it('removes the frame for unhighlight', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'unhighlight');
    expect(slot.hideMarker).toHaveBeenCalled();
  });

  it('does nothing when unknown animation is provided', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'unknown' as ZoneSlotAnimation);
    expect(slot.setBackgroundColor).not.toHaveBeenCalled();
  });

  describe('with the extra marks on', () => {
    // VIEW-39
    it('dashes the frame of the source slot', () => {
      vi.spyOn(EffectSettings, 'extraMarksAreOn').mockReturnValue(true);
      const slot = createMockZoneSlot();

      applyAnimation(slot, 'highlight_as_source');

      expect(slot.showMarker).toHaveBeenCalledWith(paletteFill('MARK_SOURCE'), true);
    });

    // VIEW-39
    it('fills the valid slot with the green of the mark at full opacity', () => {
      vi.spyOn(EffectSettings, 'extraMarksAreOn').mockReturnValue(true);
      const slot = createMockZoneSlot();

      applyAnimation(slot, 'highlight_as_target');

      expect(slot.setBackgroundColor).toHaveBeenCalledWith(paletteFill('MARK_VALID'), undefined, 1);
    });
  });
});
