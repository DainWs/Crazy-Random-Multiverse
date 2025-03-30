
type ClickType = null | 'SimpleClick' | 'DoubleClick' | 'RightClick' | 'Grab';

class MouseClickDispatcher {
  private clickCount: number;
  private isMouseDown: boolean;

  public constructor() {
    this.clickCount = 0;
    this.isMouseDown = false;
  }

  public async dispatch(event: MouseEvent): Promise<ClickType> {
    if (event.type == 'mouseup') {
      this.isMouseDown = false;
      return null;
    }

    this.clickCount++;

    if (this.clickCount > 1) {
      return null;
    }

    this.isMouseDown = true;
    await this.sleep(200);

    const currentClickCount = this.clickCount;
    this.clickCount = 0;

    if (currentClickCount == 1 && this.isMouseDown) return 'Grab';
    if (currentClickCount > 3) return null;
    if (currentClickCount > 1) return 'DoubleClick';
    return 'SimpleClick';
  }

  private sleep(miliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
  }
}


const mouseClickDispatcher = new MouseClickDispatcher();
export { ClickType };
export default mouseClickDispatcher;