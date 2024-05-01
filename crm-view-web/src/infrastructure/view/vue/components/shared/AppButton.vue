<script lang="ts" setup>
type ExpectedProps = {
  text: String,
  kind: 'primary' | 'secondary',
  hasIcon?: boolean
};

const props = withDefaults(defineProps<ExpectedProps>(), {
  kind: 'primary',
  hasIcon: false
});

const iconClass = (props.hasIcon) ? 'button--icon' : '';

type EmitEvent = { click: [] };
defineEmits<EmitEvent>();
</script>

<template>
  <div :class="`button button--hover button--animations ${iconClass} ${kind}`">
    <a @click="$emit('click')">
      <slot name="before"></slot>
      {{ text }}
      <slot name="after"></slot>
    </a>
  </div>
</template>

<style lang="scss" scoped></style>