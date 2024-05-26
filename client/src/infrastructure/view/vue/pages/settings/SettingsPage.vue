<script lang="ts" setup>
import AppArrow from '@vue-components/shared/AppArrow.vue';
import settingsController from '@vue-root/pages/settings/SettingsController';
const settings = settingsController.getSettings();
const settingSections = settingsController.getAvailableSettingSections();
const saveChanges = settingsController.saveChanges;
const onSettingChange = settingsController.onSettingChange;
const onSettingSectionClick = settingsController.onSettingSectionClick;
const onBackClick = settingsController.onBackClick;
// TODO reemplazar con clases de estilos propias
</script>

<template>
  <div class="settings">
    <div class="settings__container">
      <div class="settings__navigation col-12 col-md-3">
        <div class="navigation__item link back">
          <a @click="onBackClick">
            <AppArrow direction="left" color="white" /> Back
          </a>
        </div>
        <div v-for="settingSection in settingSections" :key="settingSection" class="navigation__item link">
          <a @click="onSettingSectionClick(settingSection)">{{ settingSection }}</a>
        </div>
      </div>
      <div class="settings__content col-12 col-md-9">
        <router-view :settings="settings" @setting-change="onSettingChange" @save-click="saveChanges" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/settings.scss"></style>
