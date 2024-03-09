<script setup>
import creditsController from '@/controllers/creditsController';
const creditSections = creditsController.getCredits();
</script>

<template>
  <div>
    <div class="credits">
      <div class="credits__container">
        <h1 class="credits__title">Credits</h1>

        <div class="credits__section-list">
          <div v-for="section in creditSections" :key="section.id" class="credits__section">
            <h2 class="text-center">{{ section.name }}</h2>
            <div class="people-list">
              <span v-for="person in section.people" :key="`${section.id}_person-${person}`">{{ person }}</span>
            </div>
          </div>
        </div>

        <div class="credits__footer pb-5 pt-2">
          <div class="menu">
            <div class="button button--hover button--left-to-right">
              <RouterLink to="/">Back</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style  lang="scss" src="@/ui/assets/styles/page/credits.scss" scoped>
</style>
