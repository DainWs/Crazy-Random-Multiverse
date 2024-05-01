<script lang="ts" setup>
import { Settings, Setting } from '@/domain/SettingsRepository';
import SettingInput from '@vue-components/SettingInput.vue';
import SettingSection from '@vue-components/SettingSection.vue';

defineProps<{ settings: Settings }>();
defineEmits<{
    settingChange: [setting: Setting],
    saveClick: []
}>();
</script>

<template>
    <SettingSection section-name="general" @save-click="$emit('saveClick')">
        <SettingInput setting-name="username" :settings="settings" @change="$emit('settingChange', $event)" />
    </SettingSection>
</template>

<style lang="scss" scoped></style>
