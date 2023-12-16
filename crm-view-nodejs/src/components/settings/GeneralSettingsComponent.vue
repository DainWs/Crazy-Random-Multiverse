<script setup lang="ts">
import { debug } from '@neutralinojs/lib';
import SettingsController from '@/services/settings/SettingsController'
import GeneralSettings from '@/services/settings/models/GeneralSettings'
import {findByName as findResolutionByName, values as windowResolutions}  from '@/services/settings/models/WindowResolution'
import {findByName as findDisplayModeByName, values as windowDisplayModes} from '@/services/settings/models/WindowDisplayMode'

let generalSettings: GeneralSettings = await SettingsController.getGeneral()

async function onSelectResolution(event: any) {
    let selectedResolution = findResolutionByName(event.target.value)
    if (selectedResolution != undefined) {
        debug.log(`Resolution option was change to ${selectedResolution}`)
        generalSettings.resolution = selectedResolution
        SettingsController.setGeneral(generalSettings)
    }
}

async function onSelectDisplayMode(event: any) {
    let selectedDisplayMode = findDisplayModeByName(event.target.value)
    if (selectedDisplayMode != undefined) {
        debug.log(`Display mode option was change to ${selectedDisplayMode}`)
        generalSettings.displayMode = selectedDisplayMode
        SettingsController.setGeneral(generalSettings)
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
                            <option v-for="[key, value] in windowResolutions()" :key="key" :value="key"
                                :selected="key == generalSettings.resolution.name" class="text-black">{{ value.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="row option">
                    <div class="d-flex align-items-center d-flex align-items-center col-12 col-sm-6 col-md-8">
                        <h2 class="text-white flex-grow-1 m-0">Display mode</h2>
                    </div>

                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-4">
                        <select class="form-select text-black" aria-label="Display mode" @change="onSelectDisplayMode($event)">
                            <option v-for="[key, value] in windowDisplayModes()" :key="key" :value="key"
                                :selected="key == generalSettings.displayMode.name" class="text-black">{{ value.name }}</option>
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
