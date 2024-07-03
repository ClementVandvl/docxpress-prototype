<template>
  <div class="d-flex gap-3">
    <h1>
      {{ headerName }}
    </h1>
    <ButtonPrimary style="width: fit-content" @click="goBack"> Retour </ButtonPrimary>
  </div>

  <div v-if="entries?.length" class="item-container">
    <EntryFile v-for="entry in entries" :key="entry.filename" class="item" :entry="entry" @delete="onDelete" @download="onDownload" />
  </div>
  <div v-else class="mt-4">
    <p>Aucun document pour le moment</p>
  </div>

  <ButtonPrimary style="width: fit-content; margin-top: 24px" @click="onUpload">
    Ajouter un {{ fileType === 'id_card' ? "nouveau document d'identité" : fileType === 'passport' ? 'nouveau passeport' : 'nouveau document' }}
  </ButtonPrimary>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { deleteFile, type FileType, type FirebaseFile, getFiles, getFileUrl, uploadFile } from '@/composables/uploadFile';
  import EntryFile from '@/components/EntryFile.vue';
  import ButtonPrimary from '@/components/ButtonPrimary.vue';

  const route = useRoute();
  const router = useRouter();

  const entries = ref<FirebaseFile[]>();
  const fileType = computed(() => {
    return route.query.type as FileType;
  });
  const headerName = computed(() => {
    switch (fileType.value) {
      case 'id_card':
        return "Vos cartes d'identité";
      case 'passport':
        return 'Vos passeports';
      default:
        return 'Autres documents';
    }
  });

  const getEntries = async () => {
    entries.value = await getFiles([fileType.value]);
  };

  const onUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async event => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      await uploadFile(file, fileType.value);
      await getEntries();
      input.remove();
    };
    input.click();
  };

  const onDelete = async (entry: FirebaseFile) => {
    await deleteFile(entry);
    await getEntries();
  };

  const onDownload = async (entry: FirebaseFile) => {
    const url = await getFileUrl(entry);
    const a = document.createElement('a');
    a.href = url;
    a.download = entry.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goBack = () => {
    router.push({ name: 'home' });
  };

  watch(
    () => route.query.type,
    () => {
      getEntries();
    },
    { immediate: true },
  );
</script>

<style scoped lang="scss">
  .item-container {
    margin-top: 16px;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
</style>
