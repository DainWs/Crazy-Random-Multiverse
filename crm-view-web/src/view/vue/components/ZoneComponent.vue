<script setup>
import { ref } from 'vue';
import CardComponent from './CardComponent.vue';
import CardSkeletonComponent from './CardSkeletonComponent.vue';

/**
    owner: {
        name: undefined,
        required: true
    }
    zone: [
        {line_index}: [ // From up(1) to bottom(3)
            {column_index}: {Card}, // From left(1) to rigth(3)
            {column_index}: null,
            {column_index..n}: {Card}
        ],
        {line_index..n}: [
            {column_index}: {Card},
            {column_index}: null,
            {column_index..n}: {Card}
        ]
        required: true
    ]
 */

const props = defineProps({owner: {required: true}, zone: {required: true}})

console.log(props.owner)
const lineIDPrefix = `${props.owner?.name}-line-`
const columnIDPrefix = `${props.owner?.name}-column-`
</script>

<template>
    <div class="zone">
        <div class="line" v-for="(lineColumns, lineIndex) in zone" :id="`${lineIDPrefix}${lineIndex}`" :key="`${lineIDPrefix}${lineIndex}`">
            <div class="column" v-for="(card, columnIndex) in lineColumns" :id="`${columnIDPrefix}${columnIndex}`" :key="`${columnIDPrefix}${columnIndex}`">
                <CardComponent :card="card" v-if="card !== undefined && card !== null"/>
                <CardSkeletonComponent v-else />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    width: 300px;
    height: 210px;

    margin: 0;

}
</style>
