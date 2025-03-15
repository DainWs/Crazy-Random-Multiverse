<script lang="ts" setup>
import Zone from '@/domain/models/Zone';
import CardComponent from '@pages/game/card/CardComponent.vue';
import { useZoneSlotAction } from '@pages/game/zone/useZoneSlotAction';

const { zone } = defineProps<{ zone: Zone }>();
const { grabCard, dropCard } = useZoneSlotAction(zone);

// grabCard($event, lineIndex, columnIndex, card)
//@dragover="onDropCard({ player: zone.owner, ...$event })"
</script>

<template>
    <div class="zone">
        <div class="zone__content">
            <div v-for="(lineColumns, lineIndex) in zone.combatants" :key="`${lineIndex}`" class="line">
                <div v-for="(card, columnIndex) in lineColumns" :key="`${lineIndex}-${columnIndex}`" class="column">
                    <div class="zone-slot drop-zone"
                        @drop="dropCard($event, lineIndex, columnIndex, card)">

                        <CardComponent v-if="card" :card="card"
                            @simpleClick="() => console.log('simple click')"
                            @doubleClick="() => console.log('doble click')"
                            @grabbed="grabCard($event, lineIndex, columnIndex, card)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/zone.scss"></style>
