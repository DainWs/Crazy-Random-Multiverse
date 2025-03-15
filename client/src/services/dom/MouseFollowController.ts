
class MouseFollowController {
  private elementsFollowingMouse: Set<HTMLElement>;
  private isAlreadyFollowingMouse: boolean;

  private onMouseMoveListener: (event: MouseEvent) => void;

  public constructor() {
    this.elementsFollowingMouse = new Set();
    this.isAlreadyFollowingMouse = false;

    this.onMouseMoveListener = this.onMousemove.bind(this);
  }

  public addElement(node: Node, ghost = false) {
    const htmlElement = this.getHtmlElementFrom(node, ghost);
    htmlElement.style.pointerEvents = 'none';
    htmlElement.style.position = 'absolute';

    if (!this.elementsFollowingMouse.has(htmlElement)) {
      this.elementsFollowingMouse.add(htmlElement);
      this.update();
    }

    return htmlElement;
  }

  private getHtmlElementFrom(node: Node, clone: boolean) {
    const element = node as HTMLElement;
    if (element.id == null || element.id.trim().length == 0) {
      element.id = `${Math.random() * 10000}-${Math.random() * 10000}`;
    }

    if (clone) {
      const clonned = element.cloneNode(true) as HTMLElement;
      clonned.id = clonned.id + '-clonned';
      return document.body.appendChild(clonned);
    }

    return element;
  }

  public removeElement(element: Node) {
    const htmlElement = element as HTMLElement;

    const elementToRemove = this.getElementThatFollowMouse(htmlElement);
    if (elementToRemove) {
      elementToRemove.style.removeProperty('pointer-events');
      elementToRemove.style.removeProperty('position');

      this.elementsFollowingMouse.delete(elementToRemove);
      this.update();
    }

    if (elementToRemove && elementToRemove.id.includes("-clonned")) {
      elementToRemove.remove();
    }
  }

  private getElementThatFollowMouse(htmlElement: HTMLElement) {
    if (this.elementsFollowingMouse.has(htmlElement)) {
      return htmlElement;
    }

    return Array.from(this.elementsFollowingMouse)
      .find(element => element.id == `${htmlElement.id}-clonned`);
  }

  private update() {
    if (!this.isAlreadyFollowingMouse && this.elementsFollowingMouse.size > 0) {
      document.addEventListener('mousemove', this.onMouseMoveListener);
      this.isAlreadyFollowingMouse = true;
    }

    if (this.elementsFollowingMouse.size <= 0) {
      document.removeEventListener('mousemove', this.onMouseMoveListener);
      this.isAlreadyFollowingMouse = false;
    }
  }

  private onMousemove(event: MouseEvent) {
    for (const elementFollowingMouse of this.elementsFollowingMouse) {
      const halfWidth = elementFollowingMouse.offsetWidth / 2;
      const halfHeight = elementFollowingMouse.offsetHeight / 2;
      elementFollowingMouse.style.left = `${event.clientX - halfWidth}px`;
      elementFollowingMouse.style.top = `${event.clientY - halfHeight}px`;
    }
  }
}

const mouseFollowController = new MouseFollowController();
export default mouseFollowController;