import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFocusTrapRef, trapFocus } from '@/views/FocusTrap';

// UI-32
describe('FocusTrap', () => {
  let outside: HTMLButtonElement;
  let notice: HTMLElement;
  let first: HTMLButtonElement;
  let second: HTMLButtonElement;
  let release: (() => void) | undefined;

  const pressTab = (shiftKey = false) => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey }));

  beforeEach(() => {
    document.body.innerHTML = '<button id="outside"></button><p id="notice"><button id="first"></button><button id="second"></button></p>';
    outside = document.getElementById('outside') as HTMLButtonElement;
    notice = document.getElementById('notice')!;
    first = document.getElementById('first') as HTMLButtonElement;
    second = document.getElementById('second') as HTMLButtonElement;
    release = undefined;
  });

  afterEach(() => {
    release?.();
  });

  describe('trapFocus', () => {
    it('focuses the first button', () => {
      release = trapFocus(notice);

      expect(document.activeElement).toBe(first);
    });

    it('focuses the container when it has no button', () => {
      const empty = document.createElement('div');
      document.body.appendChild(empty);

      release = trapFocus(empty);

      expect(document.activeElement).toBe(empty);
    });

    it('focuses the first button once the container is in the page', async () => {
      const detached = document.createElement('p');
      const button = document.createElement('button');
      detached.appendChild(button);

      release = trapFocus(detached);
      document.body.appendChild(detached);
      await Promise.resolve();

      expect(document.activeElement).toBe(button);
    });

    it('moves the focus to the next button on Tab', () => {
      release = trapFocus(notice);

      pressTab();

      expect(document.activeElement).toBe(second);
    });

    it('goes back to the first button on Tab from the last one', () => {
      release = trapFocus(notice);
      second.focus();

      pressTab();

      expect(document.activeElement).toBe(first);
    });

    it('goes to the last button on Shift+Tab from the first one', () => {
      release = trapFocus(notice);

      pressTab(true);

      expect(document.activeElement).toBe(second);
    });

    it('brings the focus back when it goes to an element outside', () => {
      release = trapFocus(notice);

      outside.focus();

      expect(document.activeElement).toBe(first);
    });

    it('lets the focus go outside once released', () => {
      trapFocus(notice)();

      outside.focus();

      expect(document.activeElement).toBe(outside);
    });
  });

  describe('createFocusTrapRef', () => {
    it('traps the focus when the element is mounted', () => {
      const trapRef = createFocusTrapRef();

      trapRef(notice);
      release = () => trapRef(null);

      expect(document.activeElement).toBe(first);
    });

    it('releases the focus when the element is unmounted', () => {
      const trapRef = createFocusTrapRef();
      trapRef(notice);

      trapRef(null);
      outside.focus();

      expect(document.activeElement).toBe(outside);
    });
  });
});
