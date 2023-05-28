<script lang="ts">

export default {
  name: 'App'
}
</script>

<template>
  <main>
    <router-view />
  </main>
</template>

<style lang="scss">
@import url('@/assets/styles/normalize.scss');

html,
body,
#app,
main {
  width: 100%;
  height: 100%;
}

main {
  background-image: url(@/assets/images/background.png);
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;

  &.white {
    border-color: white;
  }

  &.right {
    transform: rotate(-45deg) translateY(-50%);
    -webkit-transform: rotate(-45deg) translateY(-50%);
  }

  &.left {
    transform: rotate(135deg) translateY(50%);
    -webkit-transform: rotate(135deg) translateY(50%);
  }

  &.up {
    transform: rotate(-135deg) translateX(-50%);
    -webkit-transform: rotate(-135deg) translateX(-50%);
  }

  &.down {
    transform: rotate(45deg) translateX(50%);
    -webkit-transform: rotate(45deg) translateX(50%);
  }

}</style>