<script lang="ts" setup>
import SettingSection from '@/domain/settings/SettingSection';

defineProps<{ sectionName: SettingSection }>();
defineEmits<{ saveClick: [] }>();
// TODO reemplazar con clases de estilos propias
</script>

<template>
  <form class="dws--layout dws--tile dws--tile--light" :aria-label="`${sectionName} settings form`">
    <div class="title">{{ sectionName }} configuration</div>
    <slot></slot>
  </form>
</template>

<style lang="scss" scoped>
.dws--layout {
  min-height: 100%;

  padding: 1rem;
  padding-bottom: 2rem;

  .title {
    height: 2.5rem;

    font-size: 1.75rem;
    text-transform: capitalize;

    margin-bottom: 2.5rem;
  }

}
</style>
