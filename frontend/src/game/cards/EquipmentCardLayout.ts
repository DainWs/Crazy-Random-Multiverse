/** Area of a text in the space of a card, whose origin is its center. `x` and `y` are the center of the area. */
interface TextArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Most lines of values a piece of equipment can show: damage, armor and health. */
const MAX_VALUE_LINES = 3;

/** Top and bottom of the band under the artwork that holds the values, as a share of the card height from its center. */
const VALUE_BAND_TOP = 0.18;
const VALUE_BAND_BOTTOM = 0.47;

const NAME_WIDTH_RATIO = 0.5;
const NAME_HEIGHT_RATIO = 0.05;
const NAME_TOP_RATIO = 0.05;
const VALUE_WIDTH_RATIO = 0.8;

/** Pure layout of the texts of an equipment card: the name over the artwork and the values in the band under it. */
class EquipmentCardLayout {
  private readonly width: number;
  private readonly height: number;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public nameArea(): TextArea {
    const nameHeight = this.height * NAME_HEIGHT_RATIO;

    return {
      x: 0,
      y: -(this.height / 2) + this.height * NAME_TOP_RATIO + nameHeight / 2,
      width: this.width * NAME_WIDTH_RATIO,
      height: nameHeight
    };
  }

  /** The lines are centered in the band, so one or two of them do not hang from its top. */
  public valueArea(index: number, count: number): TextArea {
    const bandTop = this.height * VALUE_BAND_TOP;
    const bandHeight = this.height * (VALUE_BAND_BOTTOM - VALUE_BAND_TOP);
    const lineHeight = bandHeight / MAX_VALUE_LINES;
    const groupTop = bandTop + (bandHeight - count * lineHeight) / 2;

    return {
      x: 0,
      y: groupTop + lineHeight * (index + 0.5),
      width: this.width * VALUE_WIDTH_RATIO,
      height: lineHeight
    };
  }
}

export type { TextArea };
export default EquipmentCardLayout;
