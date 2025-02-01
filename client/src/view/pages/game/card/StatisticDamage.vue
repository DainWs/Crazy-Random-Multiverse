<script setup>
/**
 * @typedef {object} Props
 * @property {Number} value
 * @property {import('@/domain/card.js').DamageType} type
 */

/** @type {Props} */
const props = defineProps(['value', 'type']);
</script>

<template v-if="value !== undefined">
    <div class="damage">
        {{ value }}&nbsp;
        <span>
            {{ type }} DAMAGE
        </span>
    </div>
</template>

<style lang="scss"></style>
