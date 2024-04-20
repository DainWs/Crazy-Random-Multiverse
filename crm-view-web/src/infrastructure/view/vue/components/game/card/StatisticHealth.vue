<script setup>
/**
 * @typedef {object} Props
 * @property {Number} value
 * @property {Number} maxValue
 */

/** @type {Props} */
const props = defineProps(['value', 'maxValue']);
</script>

<template v-if="value !== undefined">
    <div class="health">
        {{ value }} <span v-if="maxValue">/ {{ maxValue }}</span>
    </div>
</template>

<style lang="scss"></style>
