<script setup lang="ts">
import GeneralSettingsComponent from '@/components/settings/GeneralSettingsComponent.vue'
</script>

<template>
  <main>
    <div class="overflow-auto d-flex justify-content-center align-items-center h-100">
      <div class="settings-form-div">
        <div>
          <h1 class="text-white">General settings</h1>
          <Suspense>
            <GeneralSettingsComponent />
          </Suspense>
        </div>

        <div class="btn-panel pb-5 pt-2 position-relative">
          <button type="button" class="btn btn-outline-primary">Apply</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.settings-form-div {
  padding: 2rem 4rem 0 4rem;
  width: 80%;
  height: 100%;

  background-color: rgba(58, 58, 58, 0.521);
}

.settings-form-div .btn-panel {
  display: flex;
  flex-direction: row-reverse;
}
.settings-form-div .btn {
  background-color: white;
}

.settings-form-div .btn:hover {
  background-color: var(--bs-primary);
}
</style>
