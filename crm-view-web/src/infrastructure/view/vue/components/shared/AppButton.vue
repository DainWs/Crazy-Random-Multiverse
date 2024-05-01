<script setup>
const props = defineProps({
  text: { type: string, required: true },
  kind: { type: string, required: false },
  hasIcon: { type: Boolean, required: false },
  invertAnimation: { type: Boolean, required: false }
});

let kindClass = props.kind?.toLowerCase() ?? "";
let iconClass = (props.hasIcon) ? "button--icon" : "";
let animationClass = (props.invertAnimation) ? "button--right-to-left" : "button--left-to-right";

defineEmits(['click'])
</script>

<template>
  <div :class="`button button--hover ${animationClass} ${iconClass} ${kindClass}`">
    <a @click="$emit('click')">
      <slot name="before"></slot>
      {{ text }}
      <slot name="after"></slot>
    </a>
  </div>
</template>

<style lang="scss" scoped>
</style>