<script setup>
import Card from '@/domain/models/Card';
import CardDescription from '@pages/game/card/CardDescription.vue'
import StatisticDamage from '@pages/game/card/StatisticDamage.vue';
import StatisticArmor from '@pages/game/card/StatisticArmor.vue';
import StatisticHealth from '@pages/game/card/StatisticHealth.vue';
import useClickEventWrapper from '@pages/game/card/useClickEventWrapper';

/**
 * @typedef {object} Props
 * @property {Card} card
 * @property {boolean} showInfo
 */

/** @type {Props} */
const props = defineProps({ card: { require: true }, showInfo: { require: false } });
const emit = defineEmits(['simpleClick', 'doubleClick', 'grabbed', 'drag', 'drop']);
var cardId = "id" + Math.random().toString(16).slice(2);

const { dispatchType } = useClickEventWrapper();

/**
 * @param {MouseEvent} event 
 */
 async function handleMouse(event) {
    const mouseType = await dispatchType(event);
    const currentTarget = document.getElementById(cardId);
    if (mouseType && mouseType == 'Grab') emit('grabbed', { ...event, currentTarget });
    if (mouseType && mouseType == 'SimpleClick') emit('simpleClick', { ...event, currentTarget });
    if (mouseType && mouseType == 'DoubleClick') emit('doubleClick', { ...event, currentTarget });
    console.log(mouseType)
}

console.log("a")
</script>

<template>
    <!-- TODO Colocar imagenes de fondo de los tipos de carta -->
    <div :class="`card ${props.card.type} ${props.card.rarity ?? ''} ${props.showInfo ? '' : 'no-info'}`.toLowerCase()"
        :id="cardId"
        draggable="true"

        @mousedown.left.capture="handleMouse"
        @mouseup.left.capture="handleMouse">

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
