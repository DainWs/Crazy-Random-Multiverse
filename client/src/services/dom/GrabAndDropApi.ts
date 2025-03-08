import mouseFollowController from "@/services/dom/MouseFollowController";

type MouseEventListener = (event: MouseEvent) => void;

const CREATE_GHOST_ELEMENT = true;

class GrabAndDropApi {
  private isDragging: boolean;
  private toParent: HTMLElement | null;
  private draggedElement: HTMLElement | null;
  private ghostElement: HTMLElement | null;

  private dropzoneClassname: string;

  private onDropListener: MouseEventListener;
  private onMouseOverListener: MouseEventListener;
  private onMouseOutListener: MouseEventListener;

  public constructor() {
    this.isDragging = false;
    this.toParent = null;
    this.draggedElement = null;
    this.ghostElement = null;

    this.dropzoneClassname = "drop-zone";

    this.onDropListener = this.onDrop.bind(this);
    this.onMouseOverListener = this.onMouseOver.bind(this);
    this.onMouseOutListener = this.onMouseOut.bind(this);
  }

  public grab(elementToGrab: HTMLElement) {
    if (this.isDragging) throw new Error('Aleady grabbing other element');
    this.isDragging = true;

    this.draggedElement = elementToGrab;
    this.ghostElement = mouseFollowController.addElement(this.draggedElement, CREATE_GHOST_ELEMENT);

    this.draggedElement.style.pointerEvents = 'none';
    this.draggedElement.style.opacity = '0.5';

    document.body.setAttribute('style', 'cursor: grabbing !important');
    document.body.setAttribute('grabbing', 'true');
    document.addEventListener('mouseup', this.onDropListener);
    document.addEventListener('mouseout', this.onMouseOutListener);
    document.addEventListener('mouseover', this.onMouseOverListener);
  }

  public moveElementToStartingPosition(x: number, y: number) {
    if (this.ghostElement) {
      const halfWidth = this.ghostElement.offsetWidth / 2;
      const halfHeight = this.ghostElement.offsetHeight / 2;
      this.ghostElement.style.left = `${x - halfWidth}px`;
      this.ghostElement.style.top = `${y - halfHeight}px`;
    }
  }

  private onMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isElementADropzone(target) && this.isDragging) {
      target.style.filter = 'invert(1)';

      this.toParent = target;
    }
  };

  private onMouseOut(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isElementADropzone(target) && this.isDragging) {
      target.style.removeProperty('filter');

      this.toParent = null;
    }
  };

  private isElementADropzone(element: HTMLElement) {
    return element.classList.contains(this.dropzoneClassname);
  }

  private onDrop(event: MouseEvent) {
    if (!this.draggedElement) {
      throw new Error("Dragged element is not available");
    }

    mouseFollowController.removeElement(this.draggedElement as Node);

    if (this.toParent) {
      this.toParent.appendChild(this.draggedElement);
      this.dispatchDropEvent(event);
    }

    this.reset();
  }

  private dispatchDropEvent(event: MouseEvent) {
    const dataTransfer = new DataTransfer();

    const dropEvent = new DragEvent('drop', {
      ...event,
      bubbles: true,
      cancelable: true,
      dataTransfer: dataTransfer
    });

    this.toParent?.dispatchEvent(dropEvent);
  }

  private reset() {
    if (this.draggedElement) {
      this.draggedElement.style.removeProperty('pointer-events');
      this.draggedElement.style.removeProperty('opacity');
    }

    if (this.toParent) {
      this.toParent.style.removeProperty('filter');
    }

    document.body.removeAttribute('style');
    document.removeEventListener('mouseup', this.onDropListener);
    document.removeEventListener('mouseout', this.onMouseOutListener);
    document.removeEventListener('mouseover', this.onMouseOverListener);

    this.isDragging = false;
    this.toParent = null;
    this.draggedElement = null;
    this.ghostElement = null;
  }

  public setDropZoneClassname(dropzoneClassname: string) {
    this.dropzoneClassname = dropzoneClassname;
  }
}

// Disable default Drag'n'Drop api
document.addEventListener('drag', (e) => { e.preventDefault() });
document.addEventListener('dragend', (e) => { e.preventDefault() });
document.addEventListener('dragenter', (e) => { e.preventDefault() });
document.addEventListener('dragleave', (e) => { e.preventDefault() });
document.addEventListener('dragover', (e) => { e.preventDefault() });
document.addEventListener('dragstart', (e) => { e.preventDefault() });
document.addEventListener('drop', (e) => { e.preventDefault() });

const grabAndDropApi = new GrabAndDropApi();
export default grabAndDropApi;