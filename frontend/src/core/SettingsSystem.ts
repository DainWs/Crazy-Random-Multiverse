import { computed, shallowRef } from 'vue';

/** The values of a card that the player can turn on to read them outside the card (UI-33). */
type CardValue = 'DAMAGE' | 'ARMOR' | 'HEALTH';

/** The card values in the order the settings screen lists them. */
const CARD_VALUES: readonly CardValue[] = ['DAMAGE', 'ARMOR', 'HEALTH'];

/** Where the browser keeps the card values that are on: the preferences stay on that device and are not sent anywhere (UI-27). */
const CARD_VALUES_STORAGE_KEY = 'crm.settings.cardValues';

function isCardValue(value: unknown): value is CardValue {
  return CARD_VALUES.some((cardValue) => cardValue === value);
}

/** Reads what was kept. A browser without storage, or with something else in it, starts with all off (UI-33). */
function loadCardValuesOn(): ReadonlySet<CardValue> {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(CARD_VALUES_STORAGE_KEY) ?? '[]');

    return new Set(Array.isArray(stored) ? stored.filter(isCardValue) : []);
  } catch {
    return new Set();
  }
}

function saveCardValuesOn(cardValuesOn: ReadonlySet<CardValue>) {
  try {
    window.localStorage.setItem(CARD_VALUES_STORAGE_KEY, JSON.stringify([...cardValuesOn]));
  } catch {
    // The choice still applies until the page is closed
  }
}

const currentCardValuesOn = shallowRef<ReadonlySet<CardValue>>(loadCardValuesOn());
const currentPanelOpen = shallowRef(false);

/** Read-only views for Vue components; computed does not wrap the value in a proxy. */
const cardValuesOn = computed(() => currentCardValuesOn.value);
const panelOpen = computed(() => currentPanelOpen.value);

function isCardValueOn(cardValue: CardValue): boolean {
  return currentCardValuesOn.value.has(cardValue);
}

function setCardValue(cardValue: CardValue, on: boolean) {
  const changed = new Set(currentCardValuesOn.value);
  if (on) {
    changed.add(cardValue);
  } else {
    changed.delete(cardValue);
  }

  currentCardValuesOn.value = changed;
  saveCardValuesOn(changed);
}

function openPanel() {
  currentPanelOpen.value = true;
}

function closePanel() {
  currentPanelOpen.value = false;
}

function togglePanel() {
  currentPanelOpen.value = !currentPanelOpen.value;
}

/** The settings of the player (UI-33): preferences of this browser, not game state nor part of the contract. */
const SettingsSystem = {
  cardValuesOn,
  panelOpen,
  isCardValueOn,
  setCardValue,
  openPanel,
  closePanel,
  togglePanel
};

export type { CardValue };
export { CARD_VALUES, CARD_VALUES_STORAGE_KEY };
export default SettingsSystem;
