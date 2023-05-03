<script setup lang="ts">
import { WindowSettings } from '@/vue/services/settings/models/AppSettings'
import { Resolutions } from '@/vue/services/settings/models/window/WindowResolution'
import { settingsController } from '@/vue/services/settings/SettingsController'

let generalConfiguration = await settingsController.getGeneralConfiguration()
var windowSettings: WindowSettings = generalConfiguration.window
</script>

<template>
    <!-- Window section -->
    <form>
        <div class="input-group">
            <select class="form-select" aria-label="Resolution">
                <option v-for="[key, value] in Resolutions" :key="key" :value="key" :selected="key == windowSettings.resolution.name">{{ value.name }}</option>
            </select>
        </div>
    </form>
</template>

<style scoped>
</style>
