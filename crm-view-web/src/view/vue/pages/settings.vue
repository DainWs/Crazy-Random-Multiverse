<script setup>
</script>

<template>
    <div class="settings">
        <div class="settings__container">
            <div class="settings__navigation col-12 col-md-3">
                <div class="navigation__item link back">
                    <RouterLink to="/">
                        <i class="arrow left white"></i> Back
                    </RouterLink>
                </div>
                <div class="navigation__item link">
                    <RouterLink to="/settings/general">General</RouterLink>
                </div>
            </div>
            <div class="settings__content col-12 col-md-9">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="@/view/assets/styles/page/settings.scss" scoped></style>
