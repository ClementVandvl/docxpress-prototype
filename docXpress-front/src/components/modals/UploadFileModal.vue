<template>
  <Modal v-model="opened">
    <template #header>
      <h2>Ajouter un fichier</h2>
    </template>
    <template #default>
      <div>
        <ButtonPrimary style="width: fit-content" @click="getFile"> Sélectionnez un fichier </ButtonPrimary>
        <div v-if="isLoadingFileType" class="d-flex gap-2 mt-3">
          <span> Déduction du type de fichier... </span>
          <FontAwesomeIcon class="loading-animation" :icon="faSpinner" />
        </div>
        <div v-if="fileType" class="d-flex gap-2 mt-3">
          <span> Type de fichier détecté </span>
          <select v-model="fileType">
            <option value="id_card">Carte d'identité</option>
            <option value="passport">Passeport</option>
            <option value="other">Autre</option>
          </select>
        </div>
      </div>
      <div v-if="fileType && fileRef" class="d-flex flex-end mt-3">
        <ButtonPrimary style="width: fit-content" @click="upload"> Ok </ButtonPrimary>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons';

  import Modal from '@/components/Modal.vue';
  import ButtonPrimary from '@/components/ButtonPrimary.vue';
  import { type FileType, uploadFile } from '@/composables/uploadFile';
  import { getFileType } from '@/composables/fileType';

  const opened = defineModel<boolean>({
    required: true,
  });

  const isLoadingFileType = ref(false);
  const fileType = ref<FileType | undefined>();
  const fileRef = ref<File>();

  const getFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async event => {
      fileType.value = undefined;
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        return;
      }
      isLoadingFileType.value = true;
      fileType.value = await getFileType(file);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      // fileType.value = 'id_card';
      fileRef.value = file;
      isLoadingFileType.value = false;
      input.remove();
    };
    input.click();
  };

  const upload = async () => {
    await uploadFile(fileRef.value!, fileType.value!);
    opened.value = false;
  };

  watch(opened, value => {
    if (!value) {
      fileType.value = undefined;
      fileRef.value = undefined;
    }
  });
</script>

<style scoped lang="scss">
  .loading-animation {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
