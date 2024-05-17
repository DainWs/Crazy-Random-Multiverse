<script setup>
defineProps({ description: { type: String, required: true } });
</script>

<template>
    <div class="description">
        {{ description }}
    </div>
</template>

<style lang="scss"></style>
