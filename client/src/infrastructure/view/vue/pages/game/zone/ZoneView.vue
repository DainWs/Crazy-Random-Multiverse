<script lang="ts" setup>
import ActionParts from '@/domain/actions/ActionParts';
import Zone from '@/domain/models/Zone';
import ZoneSlot from '@vue-pages/game/zone/ZoneSlot.vue';
import {
    onGrabCardFromSlot,
    onDropCardOnSlot,
    extractActionParts
} from '@vue-pages/game/zone/ZoneViewLogic'

defineProps<{ zone: Zone }>();
const emit = defineEmits<{ action: [ActionParts] }>();

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
            <div v-for="(lineColumns, lineIndex) in zone.combatants" :key="`${lineIndex}`" class="line">
                <div v-for="(card, columnIndex) in lineColumns" :key="`${lineIndex}-${columnIndex}`" class="column">
                    <ZoneSlot :v-slot="{ row: lineIndex, column: columnIndex }" :card="card"
                        @grab="onGrabCard({ player: zone.owner, ...$event })"
                        @dragover="onDropCard({ player: zone.owner, ...$event })"
                        @drop="onDragCard({ player: zone.owner, ...$event })" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@assets/styles/components/zone.scss"></style>
