<script setup>
import { ref } from 'vue';

/**
    card: { 
        type: { // TODO define class type Card
            code: { value: Number, type: String },
            name: String,
            description: String,
            type: String,
            rarity: String,
            damage: Number,
            damageType: String,
            armor: Number,
            armorType: String,
            health: Number,
            maxHealth: Number
        },
        required: true
    }
 */

const props = defineProps({ card: { required: true } })
const emit = defineEmits(['onClick', 'onDrag', 'onDrop'])

function show() {
    isShowing.value = true
    setTimeout(hide, props.hideDelayInSecods * MILISECONDS_PER_SECOND)
    emit("onShow")
}

function hide() {
    isShowing.value = false
    emit("onShow")
}

if (!props.showManually) {
    show()
}

const isEquipment = (props.card.type == 'EQUIPMENT')
const isWarrior = (props.card.type == 'WARRIOR')
const isCombatant = (props.card.type == 'LEADER' || isWarrior)
</script>

<template><!-- TODO Colocar imagenes de fondo de los tipos de carta -->
    <div v-bind:class="`card ${card.type} ${card.rarity}`"> <!-- TODO To lower case -->
        <div class="type">{{ card.type }}</div>
        <div class="name">{{ card.name }}</div>
        <div class="description">{{ card.description }}</div>

        <div class="rarity" v-if="isWarrior">
            {{ card.rarity }}<!-- TODO Mostrar correctamente el dato (con icono) -->
        </div>

        <div class="damage" v-if="isCombatant || isEquipment">
            {{ card.damage }}
            <div v-if="isCombatant">
                {{ card.damageType }}<!-- TODO Mostrar correctamente el dato (con icono) -->
            </div>
        </div>
        <div class="armor" v-if="isCombatant || isEquipment">
            {{ card.armor }}
            <div v-if="isCombatant">
                {{ card.armorType }}<!-- TODO Mostrar correctamente el dato (con icono) -->
            </div>
        </div>
        <div class="health" v-if="isCombatant || isEquipment">
            {{ card.health }} <span v-if="isCombatant">/ {{ card.maxHealth }}</span>
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
