<script lang="ts" setup>
import ReturnIcon from '@assets/images/return.svg';
import settingsController from '@vue-root/pages/settings/SettingsController';
import AppButton from '@vue-components/shared/AppButton.vue';
const settings = settingsController.getSettings();
const settingSections = settingsController.getAvailableSettingSections();
const isCurrentSettingSection = settingsController.isCurrentSettingSection;
const onSettingChange = settingsController.onSettingChange;
const onSettingSectionClick = settingsController.onSettingSectionClick;
const onBackClick = settingsController.onBackClick;
</script>

<template>
  <nav tabindex="-1" class="dws--side-nav__navigation dws--side-nav dws--side-nav--expanded dws--side-nav--ux"
    aria-label="Side navigation">
    <ul class="dws--side-nav__items">
      <li class="dws--side-nav__item back">
        <AppButton tabindex="1" text="Back" class-name="dws--btn--1xl dws--layout--size-1xl" kind="ghost"
          :icon="ReturnIcon" @click="onBackClick" />
      </li>

      <li v-for="settingSection in settingSections" :key="settingSection" class="dws--side-nav__item"
        :class="{ 'dws--side-nav__item--active': isCurrentSettingSection(settingSection) }">
        <a class="dws--side-nav__link" tabindex="0" @click="onSettingSectionClick(settingSection)">
          <span class="dws--side-nav__link-text">{{ settingSection }}</span>
        </a>
      </li>
    </ul>
  </nav>
  <div class="dws--content dws--grid">
    <router-view :settings="settings" @setting-change="onSettingChange" />
  </div>
</template>

<style lang="scss" src="@assets/styles/page/settings.scss"></style>
