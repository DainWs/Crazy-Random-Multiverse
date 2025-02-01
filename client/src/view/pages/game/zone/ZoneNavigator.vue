<script setup>
import AppArrow from '@components/shared/AppArrow.vue';

/**
 * @typedef {object} Props
 * @property {import('@/domain/models').Game} game
 */

/** @type {Props} */
const props = defineProps({ game: { require: true } });
defineEmits(['select']);
</script>

<template>
    <div class="zone-navigator">
        <div v-for="zone in game.zones" :key="zone.owner.code" @click="$emit('select', zone)">
            <div v-if="zone.owner.code === game.playerWithTurn.code">
                <AppArrow color="inherit" direction="left" />
            </div>

            <span class="zone--name">{{ zone.owner.name }}</span>
            <!-- TODO se puede mejorar la presentación de la vida que tiene -->
            <span class="zone--health">{{ zone.health }}/{{ zone.maxHealth }}</span>
        </div>
    </div>
</template>

<style lang="scss"></style>
