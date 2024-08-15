<script setup>
import CardComponent from '@vue-pages/game/card/CardComponent.vue';

/**
 * @typedef {object} Props
 * @property {import('@/domain/card').Card} card
 * @property {import('@/domain/position').Position} slot
 */

/** @type {Props} */
const props = defineProps({ slot: { require: true }, card: { require: true } });
defineEmits(['grab', 'dragover', 'drop']);
</script>

<template>
  <div class="zone-slot"
    @dragstart="$emit('grab', { slot, card, originalEvent: $event })"
    @dragover="$emit('dragover', { slot, card, originalEvent: $event })"
    @drop="$emit('drop', { slot, card, originalEvent: $event })">
    <CardComponent v-if="card" :card="card" />
  </div>
</template>

<style lang="scss"></style>
