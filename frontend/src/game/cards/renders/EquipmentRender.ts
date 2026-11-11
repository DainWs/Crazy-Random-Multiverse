import type { CardRender } from "@/game/cards/renders/CardRender";
import type EquipmentView from "@/game/cards/EquipmentView";
import type { TextArea } from "@/game/cards/EquipmentCardLayout";
import type { EquipmentValueLine } from "@/game/cards/EquipmentValueLines";
import * as TextUtils from "@/game/utils/TextUtils";
import { getText } from "@/core/Texts";
import { equipmentValueLines } from "@/game/cards/EquipmentValueLines";
import EquipmentCardLayout from "@/game/cards/EquipmentCardLayout";

const NAME_FONT_SIZE_RATIO = 0.08;
const VALUE_FONT_SIZE_RATIO = 0.07;
const NAME_COLOR = '#000';
const POSITIVE_COLOR = '#00b800';
const NEGATIVE_COLOR = '#e30000';

const render = (scene: Phaser.Scene, view: EquipmentView, width: number, height: number) => {
  const layout = new EquipmentCardLayout(width, height);
  const lines = equipmentValueLines(view.equipment);

  const nameText = createName(scene, layout.nameArea(), getText(view.equipment.name), Math.floor(height * NAME_FONT_SIZE_RATIO));
  const valueTexts = lines.map((line, index) => {
    return createValue(scene, layout.valueArea(index, lines.length), line, Math.floor(height * VALUE_FONT_SIZE_RATIO));
  });

  return [nameText, ...valueTexts];
}

function createName(scene: Phaser.Scene, area: TextArea, name: string, fontSize: number): Phaser.GameObjects.Text {
  const nameText = scene.add.text(area.x, area.y, name);
  nameText.setOrigin(0.5, 0.5);
  nameText.setColor(NAME_COLOR);
  nameText.setFontSize(fontSize);
  TextUtils.fitText(nameText, area.width, area.height);

  return nameText;
}

function createValue(scene: Phaser.Scene, area: TextArea, line: EquipmentValueLine, fontSize: number): Phaser.GameObjects.Text {
  const valueText = scene.add.text(area.x, area.y, line.text);
  valueText.setOrigin(0.5, 0.5);
  valueText.setColor(line.value > 0 ? POSITIVE_COLOR : NEGATIVE_COLOR);
  valueText.setFontSize(fontSize);
  TextUtils.fitText(valueText, area.width, area.height);

  return valueText;
}

const update = (_: Phaser.Scene, _1: EquipmentView, _2: number, _3: number) => {
  return;
}

const equipmentRender: CardRender = {
  render,
  update
}

export type { CardRender };
export default equipmentRender;
