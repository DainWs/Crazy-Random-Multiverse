interface FitTextOptions {
  minFontSize?: number;
}

type GameText = Phaser.GameObjects.Text;

function fitText(text: GameText, width: number, height: number, options: FitTextOptions = {}) {
  const { minFontSize = 6 } = options;

  let fontSize = Number(`${text.style.fontSize}`.replace('px', ''));
  let stopRunning = false;

  while (fontSize >= minFontSize && !stopRunning) {
    fontSize = Number(`${fontSize}`.replace('px', '')) - 1;
    text.setFontSize(fontSize);

    const textBounds = text.getBounds();

    const fitHorizontally = textBounds.width <= width;
    const fitVertically = textBounds.height <= height;
    if (fitHorizontally && fitVertically) {
      stopRunning = true;
    }
  }
}

export { fitText }