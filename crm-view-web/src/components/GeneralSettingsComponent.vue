<script setup>
import { ref } from 'vue'
import SettingsService from '@/services/settings/SettingsService'
import StompService from '@/services/stomp/StompService'

const username = ref('');

SettingsService.getUsername()
  .then(value => username.value = value)

async function changeUserName(event) {
    let newUsername = event.target.value
    if (newUsername != undefined) {
        username.value = newUsername
    }
}

async function persistUserName() {
    SettingsService.setUsername(username.value)
    StompService.send(StompService.Destinations.USER_UPDATE, {username: username.value})
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
                        <h2 class="text-white flex-grow-1 m-0">Name</h2>
                    </div>
                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-4">
                        <input class="text-black" type="text" v-bind:value="username" @change="changeUserName($event)" @focusout="persistUserName()"/>
                    </div>
                </div>

                <div class="row option">

                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
