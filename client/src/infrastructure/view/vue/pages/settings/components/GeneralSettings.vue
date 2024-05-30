<script lang="ts" setup>
import Settings, { SettingName, SettingValue } from '@/domain/settings/Settings';
import SettingInput from '@vue-components/SettingInput.vue';
import SettingSection from '@vue-components/SettingSection.vue';

defineProps<{ settings: Settings }>();
defineEmits<{
    settingChange: [settingName: SettingName, settingValue: SettingValue]
}>();
</script>

<template>
    <SettingSection section-name="general">
        <SettingInput setting-name="username" :setting-value="settings.getSettingValue('username')"
            @change="$emit('settingChange', 'username', $event)" />
    </SettingSection>
</template>

<style lang="scss" scoped></style>
