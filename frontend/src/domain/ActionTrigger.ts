type TriggerInput = 'SimpleClick' | 'DoubleClick' | 'Grab' | 'Drop';
type TriggerElement = 'Hand' | 'Hand.Card' | 'ZoneSlot' | 'ZoneSlot.Card';

type ActionTrigger = {
  element: TriggerElement;
  input: TriggerInput;
};

export type { TriggerInput, TriggerElement };
export default ActionTrigger;
