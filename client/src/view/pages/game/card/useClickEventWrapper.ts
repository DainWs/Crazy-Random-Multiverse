
type ClickType = null | 'Grab' | 'SimpleClick' | 'DoubleClick';
type MouseDownType = null | 'Grab';

function useClickEventWrapper() {
  let clickCount = 0;
  let isMouseDown = false;

  function sleep(miliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
  }

  async function dispatchType(event: MouseEvent): Promise<ClickType> {
    if (event.type == 'mouseup') {
      isMouseDown = false;
      return null;
    }

    clickCount++;

    if (clickCount > 1) {
      return null;
    }

    isMouseDown = true;
    await sleep(200);

    const currentClickCount = clickCount;
    clickCount = 0;

    if (currentClickCount == 1 && isMouseDown) return 'Grab';
    if (currentClickCount > 3) return null;
    if (currentClickCount > 1) return 'DoubleClick';
    return 'SimpleClick';
  }

  return { dispatchType };
}

export { ClickType };
export default useClickEventWrapper;