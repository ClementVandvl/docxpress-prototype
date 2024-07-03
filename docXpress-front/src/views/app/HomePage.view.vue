<template>
  <UploadFileModal v-model="uploadModalOpened" />
  <div style="display: flex; flex-direction: column">
    <h1>Bonjour {{ nameStore.getName() }} !</h1>
    <span style="margin-bottom: 6px"> Vous avez {{ links ?? 0 }} liens actifs. </span>

    <div class="action-container" style="margin-bottom: 24px">
      <RouterLink class="action-button" :to="{ name: 'link-list' }">
        <span> Voir vos liens partagés </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </RouterLink>
    </div>

    <h2 style="margin-bottom: 12px">Vos fichiers</h2>

    <div class="action-container">
      <RouterLink class="action-button" :to="{ name: 'file-list', query: { type: 'id_card' } }">
        <span> Vos Cartes Nationales d'Identité </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </RouterLink>
      <RouterLink class="action-button" :to="{ name: 'file-list', query: { type: 'passport' } }">
        <span> Vos Passeports </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </RouterLink>
      <RouterLink class="action-button" :to="{ name: 'file-list', query: { type: 'other' } }">
        <span> Vos autres fichiers </span>
        <FontAwesomeIcon :icon="faChevronRight" />
      </RouterLink>
    </div>
    <ButtonPrimary style="width: fit-content" class="mt-4" @click="openUploadModal"> Ajouter un fichier </ButtonPrimary>
  </div>
</template>

<script lang="ts" setup>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
  import { onBeforeMount, ref } from 'vue';

  import { getWorkingEphemerallinks } from '@/composables/links';
  import UploadFileModal from '@/components/modals/UploadFileModal.vue';
  import ButtonPrimary from '@/components/ButtonPrimary.vue';
  import { useNameStore } from '@/stores/nameStore';

  const links = ref(0);
  const uploadModalOpened = ref(false);
  const nameStore = useNameStore();

  const openUploadModal = () => {
    uploadModalOpened.value = true;
  };

  onBeforeMount(async () => {
    links.value = (await getWorkingEphemerallinks()).length;
  });
</script>

<style scoped lang="scss">
  .action-container {
    display: flex;
    flex-flow: column;
    gap: 16px;
    width: fit-content;
  }

  .action-button {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
    border-radius: 9999px;
    background-color: #7cacf8;
    padding: 8px 20px;
    color: black;

    &:hover {
      background-color: #aecbfa;
      cursor: pointer;
      color: black;
    }
  }
</style>
