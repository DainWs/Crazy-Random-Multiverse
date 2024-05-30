<script lang="ts" setup>
import { SettingName, SettingValue } from '@/domain/settings/Settings';
defineProps<{ settingName: SettingName, settingValue: SettingValue, placeholder?: string, title?: string }>();
defineEmits<{ change: [settingValue: SettingValue] }>();
</script>

<template>
  <div class="dws--form-item dws--text-input-wrapper">
    <div class="dws--text-input__label-wrapper">
      <label :for="`input-${settingName}`" class="dws--label" dir="ltr">{{ settingName }}</label>
    </div>
    <div class="dws--text-input__field-outer-wrapper">
      <div class="dws--text-input__field-wrapper">
        <input :id="`input-${settingName}`" :placeholder type="text" class="dws--text-input" :title
          :value="settingValue" @change="$emit('change', ($event.target as HTMLInputElement).value)">
        <span class="dws--text-input__counter-alert" role="alert"></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="" scoped>
label {
  font-size: 1rem;
  text-transform: capitalize;
}
</style>
