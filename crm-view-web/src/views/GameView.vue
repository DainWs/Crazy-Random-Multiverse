<script setup>
import GameController from '@/controllers/GameController';

const game = GameController.getGameInfo();
</script>

<template>
  <div style="color: white;">{{ game }}</div>
</template>
