<script setup lang="ts">
import { ProfileSettings } from '@/services/settings/models/AppSettings';
import { settingsController } from '@/services/settings/SettingsController'
import { debug } from '@neutralinojs/lib';

var settings: ProfileSettings =  await settingsController.getProfileConfiguration()

async function changeUserName(event: any) {
    let newUsername = event.target.value
    if (newUsername != undefined) {
        debug.log(`User name was change to ${newUsername}`)
        settings.username = newUsername
    }
}

async function persistUserName(event: any) {
    debug.log(`Saving changes`)
    settingsController.setProfileConfiguration(settings)
}


</script>

<template>
    <div class="overflow-auto h-100">
        <div class="settings-form-div">
            <form class="container p-0">
                <div class="row title m-0">
                    <h1 class="col-12 col-sm-12 text-black">Profile settings</h1>
                </div>

                <div class="row option">
                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-8">
                        <h2 class="text-white flex-grow-1 m-0">Name</h2>
                    </div>
                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-4">
                        <input class="text-black" type="text" value="user" @change="changeUserName($event)" @focusout="persistUserName($event)"/>
                    </div>
                </div>

                <div class="row option">
                </div>

                <div class="row option">

                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
