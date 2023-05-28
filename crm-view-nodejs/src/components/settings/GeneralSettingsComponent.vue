<script setup lang="ts">
import { WindowSettings } from '@/services/settings/models/WindowSettings'
import { Resolutions } from '@/services/settings/models/window/WindowResolution'
import { DisplayModes } from '@/services/settings/models/window/WindowDisplayMode'
import { settingsController } from '@/services/settings/SettingsController'
import { debug } from '@neutralinojs/lib';

let generalConfiguration = await settingsController.getGeneralConfiguration()
var windowSettings: WindowSettings = generalConfiguration.window

async function onSelectResolution(event: any) {
    let selectedResolution = Resolutions.get(event.target.value)
    if (selectedResolution != undefined) {
        debug.log(`Resolution option was change to ${selectedResolution}`)
        windowSettings.resolution = selectedResolution
        generalConfiguration.window = windowSettings
        settingsController.setGeneralConfiguration(generalConfiguration)
    }
}

async function onSelectDisplayMode(event: any) {
    let selectedDisplayMode = DisplayModes.get(event.target.value)
    if (selectedDisplayMode != undefined) {
        debug.log(`Display mode option was change to ${selectedDisplayMode}`)
        windowSettings.displayMode = selectedDisplayMode
        generalConfiguration.window = windowSettings
        settingsController.setGeneralConfiguration(generalConfiguration)
    }
}

</script>

<template>
    <div class="overflow-auto h-100">
        <div class="settings-form-div">
            <form class="container p-0">
                <div class="row title m-0">
                    <h1 class="col-12 col-sm-12 text-black">General settings</h1>
                </div>

                <div class="row option">
                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-8">
                        <h2 class="text-white flex-grow-1 m-0">Resolution</h2>
                    </div>
                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-4">
                        <select class="form-select text-black" aria-label="Resolution" @change="onSelectResolution($event)">
                            <option v-for="[key, value] in Resolutions" :key="key" :value="key"
                                :selected="key == windowSettings.resolution.name" class="text-black">{{ value.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="row option">
                    <div class="d-flex align-items-center d-flex align-items-center col-12 col-sm-6 col-md-8">
                        <h2 class="text-white flex-grow-1 m-0">Display mode</h2>
                    </div>

                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-4">
                        <select class="form-select text-black" aria-label="Display mode" @change="onSelectDisplayMode($event)">
                            <option v-for="[key, value] in DisplayModes" :key="key" :value="key"
                                :selected="key == windowSettings.displayMode.name" class="text-black">{{ value.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="row option">

                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
