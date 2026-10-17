import { describe, expect, it, vi } from 'vitest';
import applyAnimation, { ZoneSlotAnimation } from '@/core/visual_effects/ZoneSlotAnimation';
import ZoneSlotView from '@/game/zone/ZoneSlotView';

describe('ZoneSlotAnimation', () => {
  const createMockZoneSlot = () => {
    return {
      setBackgroundColor: vi.fn()
    } as unknown as ZoneSlotView;
  };

  it('sets red background color for highlight_as_source', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'highlight_as_source');
    expect(slot.setBackgroundColor).toHaveBeenCalledWith(0xD40000);
  });

  it('sets light green background color for highlight_as_target', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'highlight_as_target');
    expect(slot.setBackgroundColor).toHaveBeenCalledWith(0xAAFFAA);
  });

  it('sets white background color for unhighlight', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'unhighlight');
    expect(slot.setBackgroundColor).toHaveBeenCalledWith(0xffffff);
  });

  it('does nothing when unknown animation is provided', () => {
    const slot = createMockZoneSlot();
    applyAnimation(slot, 'unknown' as ZoneSlotAnimation);
    expect(slot.setBackgroundColor).not.toHaveBeenCalled();
  });
});
