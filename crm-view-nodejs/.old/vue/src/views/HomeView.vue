<script setup lang="ts">

</script>

<template>
  <main>
    <img alt="Monos con Minigun logo" class="logo rounded-circle position-absolute bottom-0 end-0 mb-4 me-4"
      src="@/assets/images/logo.png" />

    <nav class="d-flex justify-content-center align-items-center">
      <div class="d-inline-flex flex-column">
        <div class="title">
          <h1>Crazy Random Multiverses</h1>
        </div>
        <div class="d-inline-flex justify-content-between flex-column link-menu">
          <div class="link-menu--item">
            <RouterLink to="/create-game" class="text-decoration-none link-hover from-left">Create Game</RouterLink>
          </div>
          <div class="link-menu--item">
            <RouterLink to="/join-game" class="text-decoration-none link-hover from-left">Join Game</RouterLink>
          </div>
          <div class="link-menu--item">
            <RouterLink to="/settings" class="text-decoration-none link-hover from-left">Settings</RouterLink>
          </div>
          <div class="link-menu--item">
            <RouterLink to="/credits" class="text-decoration-none link-hover from-left">Credits</RouterLink>
          </div>
          <div class="link-menu--item">
            <a class="text-decoration-none link-hover from-left">Exit</a>
          </div>
        </div>
      </div>
    </nav>
  </main>
</template>

<style>
@keyframes logoAnimation {
  0% {
    box-shadow: 0 0 0 3px #c2c2c2;
  }

  50% {
    box-shadow: 0 0 0 6px #969696;
  }

  100% {
    box-shadow: 0 0 0 3px #c2c2c2;
  }
}

main {
  background-image: url(@/assets/images/background.png);
}

.logo {
  width: 10%;
  height: 10%;
  max-width: 80px;
  max-height: 80px;

  animation-name: logoAnimation;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

.title {
  margin-bottom: 3rem;
  padding: 1rem;
  background-color: white;
  position: relative;
}

.title h1 {
  cursor: default;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  user-select: none;
  margin: 0 !important;
  text-align: center;
  white-space: nowrap;
}

.title h1:before {
  background-color: #c50000;
  content: '';
  display: block;
  height: 0.25rem;
  width: 55%;
  margin-right: auto;
  margin-bottom: 1rem;
}

.title h1:after {
  background-color: #c50000;
  content: '';
  display: block;
  height: 0.25rem;
  width: 55%;
  margin-left: auto;
  margin-top: 1rem;
}

nav {
  width: 100%;
  height: 100%;
}

.link-menu a {
  color: rgb(167, 90, 27);
}

.link-menu .link-menu--item {
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 196, 0);
  margin-bottom: 3%;
}

.link-hover {
  position: relative;
  padding: 2vh 3vh;
  font-size: 1.4rem;
  color: rgb(255, 196, 0);
  letter-spacing: 1.1rem;
  text-transform: uppercase;
  transition: all 400ms cubic-bezier(0.77, 0, 0.175, 1);
  cursor: pointer;
  user-select: none;
}

.link-hover:before,
.link-hover:after {
  content: '';
  position: absolute;
  transition: inherit;
  z-index: -1;
}

.link-hover:hover {
  color: rgb(255, 196, 0);
  transition-delay: 0s;
}

.link-hover:hover:before {
  transition-delay: 0s;
}

.link-hover:hover:after {
  background: rgb(167, 90, 27);
  transition-delay: 0s;
}

/* From Left */
.from-left:before,
.from-left:after {
  top: 0;
  width: 0;
  height: 100%;
}

.from-left:before {
  right: 0;
  border: 1px solid rgb(167, 90, 27);
  border-left: 0;
  border-right: 0;
}

.from-left:after {
  left: 0;
}

.from-left:hover:before,
.from-left:hover:after {
  width: 100%;
}
</style>