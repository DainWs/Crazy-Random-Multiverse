<script lang="ts" setup>
import Zone from '@/domain/models/Zone';
import CardComponent from '@pages/game/card/CardComponent.vue';
import { useZoneSlotAction } from '@pages/game/zone/useZoneSlotAction';

const { zone, isEnemyZone } = defineProps<{ zone: Zone, isEnemyZone: boolean }>();
const { clickCard , grabCard, dropCard } = useZoneSlotAction(zone);
console.log(zone)

function rowFrom(index: number) {
    if (isEnemyZone) {
        return index - 1;
    }

    return zone.combatants.length - index;
}

// TODO Jugar una partida
function getSlotClasses(row: number, column: number) {
    let dropSlot = zone.isEnabledPosition({ row, column }) ? 'drop-zone' : '';
    return `zone-slot ${dropSlot}`;
}
</script>

<template>
    <div class="zone">
        <div class="zone__content">
            <div v-for="i in zone.combatants.length" :key="`${rowFrom(i)}`" class="line">
                <div v-for="(card, columnIndex) in zone.combatants[rowFrom(i)]" :key="`${rowFrom(i)}-${columnIndex}`" class="column">
                    <div :class="getSlotClasses(rowFrom(i), columnIndex)"
                        @drop="dropCard($event,rowFrom(i), columnIndex, card)">
                        <CardComponent v-if="card" :card="card"
                            @simpleClick="clickCard($event, rowFrom(i), columnIndex, card)"
                            @doubleClick="() => console.log('doble click')"
                            @grab="grabCard($event, rowFrom(i), columnIndex, card)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/zone.scss"></style>
