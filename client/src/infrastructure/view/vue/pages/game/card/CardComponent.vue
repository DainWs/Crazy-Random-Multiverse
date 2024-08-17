<script setup>
import Card from '@/domain/models/Card';
import CardDescription from '@vue-pages/game/card/CardDescription.vue'
import StatisticDamage from '@vue-pages/game/card/StatisticDamage.vue';
import StatisticArmor from '@vue-pages/game/card/StatisticArmor.vue';
import StatisticHealth from '@vue-pages/game/card/StatisticHealth.vue';

/**
 * @typedef {object} Props
 * @property {Card} card
 */

/** @type {Props} */
const props = defineProps({ card: { require: true } });
defineEmits(['cardMousedown', 'drag', 'drop']);
</script>

<template>
    <!-- TODO Colocar imagenes de fondo de los tipos de carta -->
    <div :class="`card ${props.card.type} ${props.card.rarity ?? ''}`.toLowerCase()"
        draggable="true"

        @mousedown="$emit('cardMousedown', $event)">

        <div class="card--type">{{ card.getTypeDescription() }}</div>
        <div class="card--name">{{ card.name }}</div>

        <div class="card--image">

        </div>

        <div class="card__details">
            <slot name="details">
                <div v-if="card.hasStatistics()">
                    <StatisticHealth :value="card.health" :max-value="card.maxHealth" />
                    <StatisticDamage :value="card.damage" :type="card.damageType" />
                    <StatisticArmor :value="card.armor" :type="card.armorType" />
                </div>
                <CardDescription :description="card.description" v-else />
            </slot>
        </div>

        <div class="card__tooltip">
            <slot name="tooltip">
                <CardDescription :description="card.description" />
            </slot>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/card.scss"></style>
