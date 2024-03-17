<script setup>
import { ref } from 'vue';

const emit = defineEmits(['onDrop'])

function onDragOver(event) {
    console.log(event)
}

function onDrop(event) {
    console.log(event)
}
</script>

<template>
    <div class="card skeleton" @dragover="onDragOver" @drop="onDrop"></div>
</template>

<style scoped lang="scss">
.skeleton {
    border: 1px dotted black;
    background-color: #ffffff99;
}
</style>
