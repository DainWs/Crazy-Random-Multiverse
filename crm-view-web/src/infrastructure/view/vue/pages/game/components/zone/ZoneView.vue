<script setup>
import ZoneSlot from '@vue-components/zone/ZoneSlot.vue';
import {
    onGrabCardFromSlot,
    onDropCardOnSlot,
    extractActionParts
} from '@vue-components/zone/ZoneViewLogic'
/**
 * @typedef {object} Props
 * @property {import('@/domain/zone').Zone} zone
 */

/** @type {Props} */
const props = defineProps({ zone: { required: true } });
const emit = defineEmits(['action']);

const onGrabCard = (event) => {
    onGrabCardFromSlot(event)
    event.originalEvent.dataTransfer.effectAllowed = 'move';
}

const onDropCard = (event) => {
    event.originalEvent.stopPropagation();
    const processedEvent = onDropCardOnSlot(event);
    const actionParts = extractActionParts(processedEvent);
    emit("action", actionParts);
    return false;
}

const onDragCard = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return;
}
</script>

<template>
    <div class="zone">
        <div class="zone__content">
            <div class="line" v-for="(lineColumns, lineIndex) in zone.combatants" :key="`${lineIndex}`">
                <div class="column" v-for="(card, columnIndex) in lineColumns" :key="`${lineIndex}-${columnIndex}`">
                    <ZoneSlot :slot="{ row: lineIndex, column: columnIndex }" :card="card"
                        @grab="onGrabCard({ player: zone.owner, ...$event })"
                        @dragover="onDropCard({ player: zone.owner, ...$event })"
                        @drop="onDragCard({ player: zone.owner, ...$event })" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/zone.scss"></style>
