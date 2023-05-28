<script setup lang="ts">

const Sections = [
  { name: 'Director', people: ['DainWs'] },
  { name: 'Developers', people: ['DainWs'] }
]

</script>

<template>
  <div>
    <div class="overflow-auto d-flex justify-content-center align-items-center h-100">
      <div class="credits">
        <h1 class="text-white text-center">Credits</h1>

        <div class="credits_sections">
          <div v-for="section in Sections" :key="`section-${section.name}`" class="credits_sections--item">
            <h2 class="text-center">{{ section.name }}</h2>
            <div class="people-list">
              <span v-for="person in section.people" :key="`section-${section.name}_person-${person}`">{{ person }}</span>
            </div>
          </div>
        </div>

        <div class="btn-panel pb-5 pt-2 position-relative">
          <div class="d-inline-flex justify-content-between flex-column link-menu">
            <div class="link-menu--item">
              <RouterLink to="/" class="text-decoration-none link-hover from-left">Back</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.credits {
  padding: 2rem 4rem 0 4rem;
  width: 80%;
  height: 100%;

  background-color: rgba(58, 58, 58, 0.521);
}

.credits_sections {}

.credits_sections--item {
  margin-bottom: 0.5rem;
  padding: 1rem;

  background-color: rgba(255, 255, 255, 0.336);
}

.credits_sections--item .people-list {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.credits_sections--item .people-list span {
  font-size: 2rem;
  font-weight: bold;
}
</style>
