<script lang="ts" setup>
type Props = {
  direction: 'left' | 'right' | 'up' | 'bottom',
  color: 'white' | 'black'
};

withDefaults(defineProps<Props>(), {
  color: 'white'
});
</script>

<template>
  <div class="arrow__container">
    <i :class="`arrow ${direction} ${color}`"></i>
  </div>
</template>

<style lang="scss" scoped></style>