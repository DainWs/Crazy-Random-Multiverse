

type CreateDOMElement = () => HTMLElement;

type StartPoint = { x: number; y: number; };
type EndPoint = { x: number; y: number; };

const customAttributePrefix = 'mte';

const trElementAttribute = `${customAttributePrefix}-tr-element`;

const spAttribute = `${customAttributePrefix}-sp-element`;
const spIDAttribute = `${customAttributePrefix}-sp-id`;

class MouseTrailController {
  private startingElements: Set<HTMLElement>;
  private elementFactories: Map<string,CreateDOMElement>;
  private isAlreadyRunning: boolean;

  private onMouseMoveListener: (event: MouseEvent) => void;

  public constructor() {
    this.startingElements = new Set();
    this.elementFactories = new Map();
    this.isAlreadyRunning = false;

    this.onMouseMoveListener = this.handleMouseMove.bind(this);
  }

  public addElement(node: Node, factoryMethod: CreateDOMElement) {
    const htmlElement = node as HTMLElement;
    if (!htmlElement.hasAttribute(spAttribute)) {
      const calculatedID = `${Math.random() * 10000}-${Math.random() * 10000}`;
  
      htmlElement.setAttribute(spAttribute, '');
      htmlElement.setAttribute(spIDAttribute, calculatedID);
  
      this.startingElements.add(htmlElement);
      this.elementFactories.set(calculatedID, factoryMethod);
      this.update();
    }

    return htmlElement;
  }

  public removeElement(node: Node) {
    const htmlElement = node as HTMLElement;
    if (htmlElement.hasAttribute(spAttribute)) {
      this.startingElements.delete(htmlElement);
      this.elementFactories.delete(htmlElement.getAttribute(spIDAttribute) ?? '');

      htmlElement.removeAttribute(spAttribute);
      htmlElement.removeAttribute(spIDAttribute);

      this.update();
    }
    
    return htmlElement;
  }

  private update() {
    if (!this.isAlreadyRunning && this.startingElements.size > 0) {
      document.addEventListener('mousemove', this.onMouseMoveListener);
      this.isAlreadyRunning = true;
    }

    if (this.startingElements.size <= 0) {
      document.removeEventListener('mousemove', this.onMouseMoveListener);
      this.isAlreadyRunning = false;
    }
  }

  private handleMouseMove(event: MouseEvent) {
    const endPoint = { x: event.clientX, y: event.clientY };

    for (const spElement of this.startingElements) {
      const trailedID = spElement.getAttribute(spIDAttribute);
      if (trailedID) {
        const centerXOfElement = spElement.getBoundingClientRect().left + spElement.offsetWidth / 2;
        const centerYOfElement = spElement.getBoundingClientRect().top + spElement.offsetHeight / 2;
  
        const startPoint = { x: centerXOfElement, y: centerYOfElement };
        this.redrawElementsOf(trailedID, startPoint, endPoint);
      }
    }
  }

  private redrawElementsOf(trailedID: string, startPoint: StartPoint, endPoint: EndPoint) {
    const createElement = this.getDOMFactoryFor(trailedID);

    const elements = document.querySelectorAll(`[${trElementAttribute}="${trailedID}"]`);
    elements.forEach(element => element.remove());

    const diferenceOnX = endPoint.x - startPoint.x;
    const diferenceOnY = endPoint.y - startPoint.y;
    const distance = Math.sqrt(diferenceOnX * diferenceOnX + diferenceOnY * diferenceOnY);
    const angle = Math.atan2(diferenceOnY, diferenceOnX) * (180 / Math.PI);

    for (let i = 0; i <= distance; i += 10) {
      const trailedElement = createElement();
      trailedElement.classList.add('trailed-element');
      trailedElement.setAttribute(trElementAttribute, trailedID);

      const distanceFactor = Math.sin((i / distance) * Math.PI);
      const spacing = 10 + distanceFactor * 20;
      
      trailedElement.style.height = `${20 + distanceFactor * 40}px`;
      trailedElement.style.left = `${startPoint.x + (diferenceOnX * i / distance) - 1.5}px`;
      trailedElement.style.top = `${startPoint.y + (diferenceOnY * i / distance) - parseFloat(trailedElement.style.height) / 2}px`;
      trailedElement.style.transform = `rotate(${angle}deg)`;
      document.body.appendChild(trailedElement);
    }    
  }

  private getDOMFactoryFor(trailedID: string) {
    const DOMFactory = this.elementFactories.get(trailedID);
    if (DOMFactory) {
      return DOMFactory;
    }

    return createDefaultElement;
  }
}

function createDefaultElement() {
  const div = document.createElement('div');
  div.style.background = 'red';
  return div;
}

const mouseTrailController = new MouseTrailController();
export default mouseTrailController;