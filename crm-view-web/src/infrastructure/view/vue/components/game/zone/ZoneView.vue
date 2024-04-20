<script setup>
import ZoneCardSlot from '@/infrastructure/view/vue/game/components/zone/ZoneCardSlot.vue';
import { 
    onGrabCardFromSlot, 
    onDragCardOverSlot,
    onDropCardOnSlot,
    extractActionParts
} from '@/infrastructure/view/vue/game/components/zone/ZoneViewLogic'
/**
 * @typedef {object} Props
 * @property {import('@/domain/zone').Zone} zone
 */

/** @type {Props} */
const props = defineProps({ zone: {required: true} });
const emit = defineEmits(['action']);

const onGrab = (event) => {
    onGrabCardFromSlot(event)
    event.originalEvent.dataTransfer.effectAllowed = 'move';
}

const onDropCardOnSlot = (event) => {
    event.originalEvent.stopPropagation();
    const processedEvent = onDropCardOnSlot(event);
    const actionParts = extractActionParts(processedEvent);
    emit("action", actionParts);
    return false;
}

const onDragCardOverSlot = (event) => {
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
                    <ZoneCardSlot :slot="{row: lineIndex, column: columnIndex}" :card="card"
                        @grab="onGrab({ player: zone.owner, ...$event })"
                        @dragover="onDragCardOverSlot({ player: zone.owner, ...$event })"
                        @drop="onDropCardOnSlot({ player: zone.owner, ...$event })"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@/infrastructure/view/assets/styles/components/zone.scss">
</style>
