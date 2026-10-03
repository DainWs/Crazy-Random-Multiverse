interface FitTextOptions {
  minFontSize?: number;
}

type GameText = Phaser.GameObjects.Text;
type Measure = (fontSize: number) => TextBounds;

interface TextBounds {
  width: number;
  height: number;
}

const createDefaultMeasure = (text: GameText): Measure => {
  return (size: number) => {
    text.setFontSize(size);
    return text.getBounds();
  }
}

function calculateFittingFontSize(
  initialFontSize: number,
  targetWidth: number,
  targetHeight: number,
  measure: (fontSize: number) => TextBounds,
  minFontSize = 6
): number {
  let fontSize = initialFontSize;

  while (fontSize >= minFontSize) {
    const bounds = measure(fontSize);
    if (bounds.width <= targetWidth && bounds.height <= targetHeight) {
      return fontSize;
    }
    fontSize--;
  }

  return minFontSize;
}

function fitText(text: GameText, width: number, height: number, options: FitTextOptions = {}) {
  const { minFontSize = 6 } = options;
  const initialFontSize = Number(`${text.style.fontSize}`.replace('px', ''));

  const finalFontSize = calculateFittingFontSize(
    initialFontSize,
    width, height,
    createDefaultMeasure(text),
    minFontSize
  );

  text.setFontSize(finalFontSize);
}

export type { FitTextOptions, TextBounds, Measure };
export { fitText, calculateFittingFontSize, createDefaultMeasure };