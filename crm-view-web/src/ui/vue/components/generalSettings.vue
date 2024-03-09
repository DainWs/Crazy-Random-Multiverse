<script setup>
import settingsController from '@/controllers/settingsController';
const username = settingsController.getUsername();
const onChangeUsername = settingsController.changeUsername;
const persistUsername = settingsController.persistUsername;
</script>

<template>
    <div class="general-settings">
        <div class="general-settings__container">
            <form class="container p-4">
                <div class="title m-0">
                    <h1 class="col-12 col-sm-12">General settings</h1>
                </div>

                <div class="d-flex flex-row option">
                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-8">
                        <h2 class="text-white flex-grow-1 m-0">Name</h2>
                    </div>
                    <div class="d-flex align-items-center col-12 col-sm-6 col-md-4">
                        <input class="text-black" type="text" v-bind:value="username" 
                            @change="onChangeUsername($event)" @focusout="persistUsername()"/>
                    </div>
                </div>

                <div class="option">

                </div>
            </form>
        </div>
    </div>
</template>

<style lang="scss" src="@/ui/assets/styles/page/components/generalSettings.scss" scoped></style>
