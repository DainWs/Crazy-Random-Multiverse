<script lang="ts" setup>
import { SettingSectionName } from '@/domain/SettingsRepository';

defineProps<{ sectionName: SettingSectionName }>();
defineEmits<{ saveClick: [] }>();
</script>

<template>
  <div class="general-settings">
    <div class="general-settings__container">
      <form class="container p-4">
        <div class="title m-0">
          <h1 class="col-12 col-sm-12">{{ sectionName }}</h1>
        </div>
        <hr />

        <slot></slot>

        <hr />
        <div class="option menu">
          <div class="button button--hover button--left-to-right">
            <a @click="$emit('saveClick')">Guardar</a>
            <!-- TODO deshabilitar boton cuando no hay nada que guardar -->
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
