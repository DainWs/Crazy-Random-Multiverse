<script lang="ts" setup>
import * as errorViewerController from '@components/ErrorViewerController';
const errorQueue = errorViewerController.getReactiveErrors();
const shouldShowQueue = errorViewerController.shouldShowQueue;
</script>

<template>
  <div class="error-viewer" v-show="shouldShowQueue()">
    <span v-for="(errorMesssage, index) in errorQueue" :key="index" class="error">
      {{ errorMesssage }}
    </span>
  </div>
</template>

<style lang="scss" src="@assets/styles/components/errorViewer.scss"></style>