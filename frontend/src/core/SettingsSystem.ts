import { computed, shallowRef } from 'vue';

const currentPanelOpen = shallowRef(false);

/** Read-only view for Vue components; computed does not wrap the value in a proxy. */
const panelOpen = computed(() => currentPanelOpen.value);

function openPanel() {
  currentPanelOpen.value = true;
}

function closePanel() {
  currentPanelOpen.value = false;
}

function togglePanel() {
  currentPanelOpen.value = !currentPanelOpen.value;
}

/** The settings screen (UI-33), with no options in the MVP: it only opens and closes. */
const SettingsSystem = {
  panelOpen,
  openPanel,
  closePanel,
  togglePanel
};

export default SettingsSystem;
