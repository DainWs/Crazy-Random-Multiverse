<script lang="ts" setup>
withDefaults(defineProps<{
  text: string,
  kind?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost',
  className?: string,
  icon?: string,
}>(), {
  kind: 'primary',
  className: ''
});

defineEmits<{ click: [] }>();
</script>

<template>
  <button :class="`dws--btn dws--btn--${kind} ${className}`" @click="$emit('click')" @keyup.enter="$emit('click')">
    <slot name="before"></slot>

    <p>{{ text }}</p>
    <img v-if="icon" :src="icon" class="dws--btn__icon" />
    <slot name="after"></slot>
  </button>
</template>