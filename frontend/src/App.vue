<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { AUTO } from 'phaser';
import { Boot } from '@/scenes/Boot';
import { GameOver } from '@/scenes/GameOver';
import { GameLoad } from '@/scenes/GameLoad';
import { GameScene } from '@/scenes/Game';
import { MainMenu } from '@/scenes/MainMenu';
import { Preloader } from '@/scenes/Preloader';
import useAppController from '@/AppController';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    pixelArt: true,
    transparent: true,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        GameLoad,
        GameScene,
        GameOver
    ],
    audio: {
        disableWebAudio: false
    }
};

const controller = useAppController(config);

onMounted(controller.createGame);
onUnmounted(controller.destroyGame);

const game = controller.getReactiveGame();
const scene = controller.getReactiveScene();
defineExpose({ scene, game });
</script>

<template>
    <div id="game-container"></div>
</template>

<style>
html, body {
    background-image: url(assets/background_gold.png);
    background-position: center center;
}

#game-container {
    width: 100vw;
    height: 100vh;
}
</style>