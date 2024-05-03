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

defineEmits(['click', 'drag', 'drop']);    
</script>

<template>
    <!-- TODO Colocar imagenes de fondo de los tipos de carta -->
    <div :class="`gcard ${props.card.type} ${props.card.rarity ?? ''}`.toLowerCase()"
        @click="$emit('click', $event, card)" @drag="$emit('drag', $event, card)" @drop="$emit('drop', $event, card)"
        draggable="true">
        <div class="gcard--type">{{ card.getTypeDescription() }}</div>
        <div class="gcard--name">{{ card.name }}</div>

        <div class="gcard--image">

        </div>

        <div class="gcard__details">
            <slot name="details">
                <div v-if="card.hasStatistics()">
                    <StatisticHealth :value="card.health" :max-value="card.maxHealth" />
                    <StatisticDamage :value="card.damage" :type="card.damageType" />
                    <StatisticArmor :value="card.armor" :type="card.armorType" />
                </div>
                <CardDescription :description="card.description" v-else />
            </slot>
        </div>

        <div class="gcard__tooltip">
            <slot name="tooltip">
                <CardDescription :description="card.description" />
            </slot>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/card.scss"></style>
