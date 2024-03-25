<script setup>
/**
 * @typedef {object} Settings
 * @property {string} username
 */

/**
 * @typedef {object} Props
 * @property {Settings} settings
 */

/** @type {Props} */
const props = defineProps(['settings']);
defineEmits(['settingChange', 'saveClick'])
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
                        <input class="text-black" type="text" :value="settings.username" 
                            @change="$emit('settingChange', { name: 'username', value: $event.target.value })"/>
                    </div>
                </div>

                <div class="option menu">
                    <div class="button button--hover button--left-to-right">
                        <a @click="$emit('saveClick')">Guardar</a>
                        <!-- TODO deshabilitar boton cuando no hay nada que guardar -->
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style lang="scss" src="@/view/assets/styles/components/generalSettings.scss" scoped></style>
