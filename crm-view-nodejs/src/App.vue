<script lang="ts">
import { RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    RouterView
  }
}
</script>

<template>
  <RouterView/>
</template>

<style>
@import url('@/assets/styles/normalize.scss');

html, body, #app, main {
  width: 100%;
  height: 100%;
}

main {
  background-image: url(@/assets/images/background.png);
}
</style>