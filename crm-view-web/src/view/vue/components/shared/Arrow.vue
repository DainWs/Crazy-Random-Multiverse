<script setup>
defineProps(['direction', 'color']);
</script>

<template>
  <div class="arrow__container">
    <i :class="`arrow ${direction} ${color ?? 'white'}`"></i>
  </div>
</template>

<style lang="scss" scoped>
</style>