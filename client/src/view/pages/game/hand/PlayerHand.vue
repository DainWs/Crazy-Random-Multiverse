<script lang="ts" setup>
import Hand from '@/domain/models/Hand';
import CardComponent from '@pages/game/card/CardComponent.vue';
import { useHandSlotAction } from '@pages/game/hand/useHandSlotAction';

const { hand } = defineProps<{ hand: Hand | null }>();
const { grabCard, dropCard } = useHandSlotAction(hand);

</script>

<template>
    <div class="hand" v-if="hand">
        <div class="hand__content">
            <div v-for="(card, position) in hand.cards" :key="`hand--card-${position}`"
                class="hand-slot" @drop="dropCard($event, position, card)">
                <CardComponent :card="card" :showInfo="false" 
                    @simpleClick="() => console.log('simple click')"
                    @doubleClick="() => console.log('doble click')"
                    @grab="grabCard($event, position, card)" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/hand.scss"></style>
