<script setup>
import creditsController from '@/view/vue/controllers/creditsController';
const credits = creditsController.getCredits();
const onBackClick = creditsController.onBackClick;
</script>

<template>
  <div>
    <div class="credits">
      <div class="credits__container">
        <h1 class="credits__title">Credits</h1>

        <div class="credits__section-list">
          <div v-for="section in credits" :key="section.id" class="credits__section">
            <h2 class="text-center">{{ section.name }}</h2>
            <div class="people-list">
              <span v-for="person in section.people" :key="`${section.id}_${person}`">{{ person }}</span>
            </div>
          </div>
        </div>

        <div class="credits__footer pb-5 pt-2">
          <div class="menu">
            <div class="button button--hover button--left-to-right">
              <a @click="onBackClick">Back</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style  lang="scss" src="@/view/assets/styles/page/credits.scss" scoped>
</style>
