<script setup>
/**
 * @typedef {object} Props
 * @property {Number} value
 * @property {import('@/domain/card.js').ArmorType} type
 */

/** @type {Props} */
const props = defineProps(['value', 'type']);
</script>

<template v-if="value !== undefined">
    <div class="armor">
        {{ value }}&nbsp;
        <span>
            {{ type }} ARMOR
        </span>
    </div>
</template>

<style lang="scss"></style>
