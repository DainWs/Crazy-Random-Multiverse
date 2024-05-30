<script lang="ts" setup>
defineProps < { small?: boolean } > ();
</script>

<template>
  <div aria-atomic="true" aria-live="assertive" class="dws--loading" :class="{ 'dws--loading--small': small }">
    <svg class="dws--loading__svg" viewBox="0 0 100 100">
      <title>loading</title>
      <circle class="dws--loading__stroke" cx="50%" cy="50%" r="44"></circle>
    </svg>
  </div>
</template>

<style lang="scss" scoped></style>