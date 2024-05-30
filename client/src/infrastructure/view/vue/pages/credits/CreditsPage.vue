<script lang="ts" setup>
import creditsController from '@vue-pages/credits/CreditsController';
const credits = creditsController.getCredits();
const onBackClick = creditsController.onBackClick;
</script>

<template>
  <div class="dws--content">
    <div class="dws--tile">
      <h1 class="dws--title">Credits</h1>
      <img src="@assets/images/close-large.svg" class="dws--credits--close" @click="onBackClick" />
      <section class="dws--credits__section">
        <div v-for="section in credits" :key="section.id">
          <h3>{{ section.name }}</h3>
          <p class="people-list">
            <span v-for="person in section.people" :key="`${section.id}_${person}`">{{ person }}</span>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/credits.scss" scoped></style>
