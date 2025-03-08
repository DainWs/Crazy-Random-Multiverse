<script lang="ts" setup>
import creditsJson from '@resources/Credits.json';
import { navigator } from '@view/configuration/router';

const onBackClick = navigator.navigateToFunc('home');
</script>

<template>
  <div class="dws--content">
    <div class="dws--tile">
      <h1 class="dws--title">Credits</h1>
      <img src="@assets/images/close-large.svg" class="dws--credits--close" @click="onBackClick" />
      <section class="dws--credits__section">
        <div v-for="section in creditsJson.credits" :key="section.id">
          <h3>{{ section.name }}</h3>
          <p class="dws--credits__people">
            <span v-for="person in section.people" :key="`${section.id}_${person}`">{{ person }}</span>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/credits.scss" scoped></style>
