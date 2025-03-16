import { toRef } from 'vue';
<script lang="ts" setup>
import Zone from '@/domain/models/Zone';
import CardComponent from '@pages/game/card/CardComponent.vue';
import { useZoneSlotAction } from '@pages/game/zone/useZoneSlotAction';

const { zone } = defineProps<{ zone: Zone }>();
const { clickCard , grabCard, dropCard } = useZoneSlotAction(zone);
</script>

<template>
    <div class="zone">
        <div class="zone__content">
            <div v-for="(lineColumns, lineIndex) in zone.combatants" :key="`${lineIndex}`" class="line">
                <div v-for="(card, columnIndex) in lineColumns" :key="`${lineIndex}-${columnIndex}`" class="column">
                    <div class="zone-slot drop-zone"
                        @drop="dropCard($event, lineIndex, columnIndex, card)">
                        <CardComponent v-if="card" :card="card"
                            @simpleClick="clickCard($event, lineIndex, columnIndex, card)"
                            @doubleClick="() => console.log('doble click')"
                            @grab="grabCard($event, lineIndex, columnIndex, card)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/zone.scss"></style>
