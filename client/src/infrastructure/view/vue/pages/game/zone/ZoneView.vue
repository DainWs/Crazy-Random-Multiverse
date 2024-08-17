<script lang="ts" setup>
import Zone from '@/domain/models/Zone';
import CardComponent from '@vue-pages/game/card/CardComponent.vue';
import { useZoneSlotAction } from '@vue-pages/game/hooks/useZoneSlotAction';

const { zone } = defineProps<{ zone: Zone }>();
const { grabCard, dropCard } = useZoneSlotAction(zone);

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
                            @mousedown="grabCard($event, lineIndex, columnIndex, card)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/zone.scss"></style>
