<script setup>
import { ref, triggerRef } from 'vue';

const MILISECONDS_PER_SECOND = 1000

const props = defineProps({
    message: { type: String, required: true },
    showManually: { type: Boolean, required: false, default: false },
    hideDelayInSecods: { type: Number, required: false, default: 5 }
})
const emit = defineEmits(['onShow', 'onHide'])

const isShowing = ref(false)

function show() {
    console.log(isShowing)
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

defineExpose({show, hide})
</script>

<template>
    <div v-show="isShowing" class="error-message">
        <p>{{ message }}</p>
    </div>
</template>

<style scoped lang="scss">
.error-message {
    width: max-content;
    height: min-content;

    transform: translateX(-50%) translateY(-50%);
    position: fixed;
    left: 50vw;
    top: 50vh;
    
    z-index: 1000;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.56);

    & > p {
        margin: 0;
        padding: 1rem 1.5rem;
        
        color: white;
        user-select: none;
    }
}
</style>
