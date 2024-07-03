<template>
  <div class="app-container">
    <div class="left-bar">
      <img src="/logo.png" alt="logo" />
      <NavLink :to="{ name: 'home' }">
        <span> Accueil </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </NavLink>
      <NavLink :to="{ name: 'file-list', query: { type: 'id_card' } }">
        <span> Vos CNI </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </NavLink>
      <NavLink :to="{ name: 'file-list', query: { type: 'passport' } }">
        <span> Vos Passeports </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </NavLink>
      <NavLink :to="{ name: 'file-list', query: { type: 'other' } }">
        <span> Vos autres fichiers </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </NavLink>
      <NavLink :to="{ name: 'link-list' }">
        <span> Vos liens partagés </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </NavLink>
    </div>
    <div class="app">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  import NavLink from '@/components/NavLink.vue';
</script>

<style scoped>
  .app-container {
    display: flex;
    flex-direction: row;
    min-height: 100vh;

    .left-bar {
      display: flex;
      flex-direction: column;
      background-color: #003f5a;
      width: 200px;
      padding-top: 20px;
      gap: 20px;

      img {
        align-self: center;
        width: 80px;
        margin-bottom: 20px;
      }
    }

    .app {
      flex: 1;
      padding: 20px;
    }
  }
</style>
