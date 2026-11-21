<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { AUTO, Scale } from 'phaser';
import { Boot } from '@/scenes/Boot';
import { GameLoad } from '@/scenes/GameLoad';
import { GameScene } from '@/scenes/Game';
import { Preloader } from '@/scenes/Preloader';
import useAppController from '@/AppController';
import { RENDER_SCALE } from '@/core/Constants';
import SessionSystem from '@/core/SessionSystem';
import MainMenuView from '@/views/MainMenuView.vue';
import PartyView from '@/views/PartyView.vue';
import ConnectionNotice from '@/views/ConnectionNotice.vue';
import SettingsButton from '@/views/SettingsButton.vue';
import SettingsPanel from '@/views/SettingsPanel.vue';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    scale: {
        mode: Scale.NONE,
        zoom: 1 / RENDER_SCALE,
        width: window.innerWidth * RENDER_SCALE,
        height: window.innerHeight * RENDER_SCALE
    },
    parent: 'game-container',
    pixelArt: false,
    antialias: true,
    transparent: true,
    scene: [
        Boot,
        Preloader,
        GameLoad,
        GameScene
    ],
    audio: {
        disableWebAudio: false
    }
};

const controller = useAppController(config);

onMounted(controller.createGame);
onUnmounted(controller.destroyGame);

const game = controller.getReactiveGame();
const screen = SessionSystem.screen;
const scene = controller.getReactiveScene();
defineExpose({ scene, game });
</script>

<template>
    <ConnectionNotice />
    <MainMenuView v-if="screen === 'MAIN_MENU'" />
    <PartyView v-else-if="screen === 'PARTY'" />
    <div id="game-container" :class="{ 'is-hidden': screen !== 'GAME' }"></div>
    <template v-if="screen === 'MAIN_MENU' || screen === 'GAME'">
        <SettingsPanel />
        <SettingsButton />
    </template>
</template>

<style>
:root {
    --panel-background: #1b2631;
    --panel-border: #34495e;
    --text-color: #ffffff;
    --alert-color: #e74c3c;
    --veil-background: rgba(0, 0, 0, 0.7);
    --button-background: #34495e;
    --button-hover-background: #46627f;
    --ui-font: 'Atkinson Hyperlegible', sans-serif;
}

html,
body {
    font-family: var(--ui-font);
    background-image: url(assets/background_gold.png);
    background-position: center center;
}

.screen {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.error {
    color: #b00020;
}

#game-container.is-hidden {
    visibility: hidden;
}

#game-container {
    width: 100vw;
    height: 100vh;
}
</style>