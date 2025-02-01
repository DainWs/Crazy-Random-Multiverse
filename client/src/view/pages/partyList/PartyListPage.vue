<script lang="ts" setup>
import usePartyListController from '@pages/partyList/usePartyListController';

const partyListController = usePartyListController();
const partyStore = partyListController.getReactivePartyList();
const onRefreshPartiesClick = partyListController.onRefreshPartiesClick;
const onJoinPartyClick = partyListController.onJoinPartyClick;
const onBackClick = partyListController.onBackClick;
</script>

<template>
  <div class="party-list">
    <div class="party-list__container bg-dark text-light">
      <div class="party-list__header">
        <h1 class="title">Lista de fiestas</h1>
      </div>
      <ul class="party-list__content">
        <li v-for="party in partyStore.allParties" :key="`list-item__${party.code}`">
          <span>{{ party.name }}</span>
          <div class="content-splitter"></div>
          <span class="members-count">Jugadores: {{ party.getUserCapacity() }}</span>
          <div class="button button--icon">
            <a v-show="!party.isFullCapacity()" @click="onJoinPartyClick(party)">Entrar &#10095;</a>
          </div>
        </li>
      </ul>
      <div class="party-list__footer menu menu--horizontal">
        <div class="button button--hover button--left-to-right secondary">
          <a @click="onBackClick">Volver</a>
        </div>
        <div class="button button--hover button--left-to-right">
          <a @click="onRefreshPartiesClick">Actualizar</a>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" src="@assets/styles/page/partyList.scss" scoped></style>