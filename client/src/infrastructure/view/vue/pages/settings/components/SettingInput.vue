<script lang="ts" setup>
import { SettingName, SettingValue } from '@/domain/settings/Settings';
defineProps<{ settingName: SettingName, settingValue: SettingValue }>();
defineEmits<{ change: [settingValue: SettingValue] }>();
// TODO reemplazar con clases de estilos propias
</script>

<template>
  <div class="d-flex flex-row option">
    <div class="d-flex align-items-center col-12 col-sm-6 col-md-8">
      <h5 class="text-white flex-grow-1 m-0">{{ settingName }}</h5>
    </div>
    <div class="d-flex align-items-center col-12 col-sm-6 col-md-4">
      <input class="text-black" type="text" :value="settingValue"
        @change="$emit('change', ($event.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<style lang="scss" src="" scoped></style>
