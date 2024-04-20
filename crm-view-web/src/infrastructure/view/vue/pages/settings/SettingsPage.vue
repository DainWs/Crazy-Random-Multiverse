<script setup>
import AppArrow from '@/infrastructure/view/vue/shared/AppArrow.vue'
import settingsController from '@/infrastructure/view/vue/settings/SettingsController';
const settings = settingsController.getSettings();
const settingSections = settingsController.getAvailableSettingSections();
const saveChanges = settingsController.saveChanges;
const onSettingChange = settingsController.onSettingChange;
const onSettingSectionClick = settingsController.onSettingSectionClick;
const onBackClick = settingsController.onBackClick;
</script>

<template>
    <div class="settings">
        <div class="settings__container">
            <div class="settings__navigation col-12 col-md-3">
                <div class="navigation__item link back">
                    <a @click="onBackClick">
                        <AppArrow direction="left" /> Back
                    </a>
                </div>
                <div v-for="settingSection in settingSections" :key="settingSection.id" class="navigation__item link">
                    <a @click="onSettingSectionClick(settingSection)">{{settingSection.name}}</a>
                </div>
            </div>
            <div class="settings__content col-12 col-md-9">
                <router-view
                    :settings="settings" 
                    @settingChange="onSettingChange"
                    @saveClick="saveChanges"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@/infrastructure/view/assets/styles/page/settings.scss" scoped></style>
