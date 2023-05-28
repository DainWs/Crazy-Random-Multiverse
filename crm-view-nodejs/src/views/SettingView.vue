<script setup lang="ts">
import { ref } from 'vue';
import GeneralSettingsComponent from '@/components/settings/GeneralSettingsComponent.vue';
import ProfileSettingsComponent from '@/components/settings/ProfileSettingsComponent.vue';

let sectionToLoad = ref('general');
function changeSection(newSection: string) {
  sectionToLoad.value = newSection;
}
</script>

<template>
  <div class="settings">
    <div class="settings-row">
      <div class="settings-nav col-12 col-md-3">
        <div class="settings-nav__item back">
          <router-link to="/" class="link text-decoration-none"><i class="arrow left white"></i> Back</router-link>
        </div>
        <div class="settings-nav__item" @click="() => changeSection('general')">
          <button class="link text-decoration-none">General</button>
        </div>
        <div class="settings-nav__item" @click="() => changeSection('profile')">
          <button class="link text-decoration-none">Profile</button>
        </div>
      </div>
      <div class="settings-body col-12 col-md-9">
        <Suspense v-if="sectionToLoad == 'general'">
          <GeneralSettingsComponent />
        </Suspense>
        <Suspense v-if="sectionToLoad == 'profile'">
          <ProfileSettingsComponent />
        </Suspense>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$settings-text: white;
$settings-background: rgba(56, 56, 56, 0.3);

$settings-nav-background: $settings-background;

$settings-btn-text: $settings-text;
$settings-btn-borders: rgba(49, 49, 49, 0.3);
$settings-btn-background: rgba(49, 49, 49, 0.3);
$settings-btn-hover: rgba(17, 17, 17, 0.822);

$settings-btn-back-text: $settings-text;
$settings-btn-back-borders: rgba(29, 29, 29, 0.5);
$settings-btn-back-background: rgba(31, 31, 31, 0.5);
$settings-btn-back-hover: rgba(17, 17, 17, 0.822);

$settings-option-even-text: $settings-text;
$settings-option-even-background: rgba(39, 39, 39, 0.4);
$settings-option-odd-text: $settings-text;
$settings-option-odd-background: rgba(79, 79, 79, 0.4);

.settings {
  width: 100%;
  height: 100%;
  display: grid;

  * {
    color: $settings-text;
  }

  background-color: $settings-background;

  &-row {
    width: 100% !important;
    height: 100% !important;

    display: flex;
    flex-wrap: wrap;
  }

  &-nav {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    margin: 0;
    padding: 0;

    background-color: $settings-nav-background;

    &__item {
      width: 100%;

      display: flex;
      flex-direction: column;

      & .link {
        padding: 1rem 1rem;
        color: $settings-btn-text;
        font-size: 1.4rem;

        &:hover {
          background-color: $settings-btn-hover;
        }
      }

      border: 1px solid $settings-btn-borders;
      background-color: $settings-btn-background;

      &.back {
        * {
          color: $settings-btn-back-text;
        }

        position: relative;

        border: 1px solid $settings-btn-back-borders;
        background-color: $settings-btn-back-background;

        &:hover {
          background-color: $settings-btn-back-hover;
        }
      }
    }
  }

  &-body {
    & .title {
      padding: 1rem;
      background-color: white;
      position: relative;

      h1 {
        cursor: default;
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 0.1rem;
        text-transform: uppercase;
        user-select: none;
        margin: 0 !important;
        text-align: center;
        white-space: nowrap;

        &:before,
        &:after {
          background-color: #c50000;
          content: '';
          display: block;
          height: 0.25rem;
          width: 55%;
        }

        &:before {
          margin-right: auto;
          margin-bottom: 1rem;
        }

        &:after {
          margin-left: auto;
          margin-top: 1rem;
        }
      }
    }

    & .option {
      margin: 0 !important;
      min-height: 3rem;

      &:nth-child(even) {
        * {
          color: $settings-option-even-text;
        }

        background-color: $settings-option-even-background;
      }

      &:nth-child(odd) {
        * {
          color: $settings-option-odd-text;
        }

        background-color: $settings-option-odd-background;
      }
    }
  }
}
</style>
