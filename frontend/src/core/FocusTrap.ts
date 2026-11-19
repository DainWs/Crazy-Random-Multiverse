const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

function focusablesOf(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/** Puts the focus on the first button of `container`, or on the container itself when it has none, and keeps it inside
 * until the returned function is called (UI-32). */
function trapFocus(container: HTMLElement): () => void {
  const focusFirst = () => {
    const [first] = focusablesOf(container);
    if (!first) {
      container.tabIndex = -1;
    }

    (first ?? container).focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') {
      return;
    }

    event.preventDefault();
    const focusables = focusablesOf(container);
    if (focusables.length === 0) {
      container.focus();
      return;
    }

    const current = focusables.indexOf(document.activeElement as HTMLElement);
    const next = current === -1 ? (event.shiftKey ? focusables.length - 1 : 0) : current + (event.shiftKey ? -1 : 1);
    focusables[(next + focusables.length) % focusables.length].focus();
  };

  const onFocusIn = (event: FocusEvent) => {
    if (!container.contains(event.target as Node)) {
      focusFirst();
    }
  };

  // Vue sets a template ref before it inserts the element in the page, and an element that is not in the page cannot be focused
  if (container.isConnected) {
    focusFirst();
  } else {
    queueMicrotask(focusFirst);
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('focusin', onFocusIn);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('focusin', onFocusIn);
  };
}

/** A function for the `ref` of an element of a template: the focus is trapped in the element while it is mounted. */
function createFocusTrapRef(): (element: unknown) => void {
  let release: (() => void) | undefined;

  return (element: unknown) => {
    release?.();
    release = element instanceof HTMLElement ? trapFocus(element) : undefined;
  };
}

export { createFocusTrapRef, trapFocus };
