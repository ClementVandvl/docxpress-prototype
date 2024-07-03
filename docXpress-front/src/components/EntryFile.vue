<template>
  <Modal v-model="opened" width="90%" height="100%">
    <template #header>
      <div class="d-flex">
        <h2>{{ entry.filename }}</h2>
        <div class="ml-4 d-flex gap-2">
          <ButtonPrimary @click="emit('download', entry)"> Télécharger </ButtonPrimary>
          <ButtonPrimary @click="emit('delete', entry)"> Supprimer </ButtonPrimary>
        </div>
      </div>
    </template>
    <template #default>
      <img v-if="isImage" class="center-image" :src="contentUrl" width="100%" :alt="entry.filename" />
      <iframe v-else :src="contentUrl" width="100%" height="100%"></iframe>
    </template>
  </Modal>

  <Modal v-model="createLinkModalOpened">
    <template #header>
      <h2>Créer un lien</h2>
    </template>
    <template #default>
      <div class="d-flex gap-2">
        <span>Durée de validité en minutes:</span>
        <input v-model="linkDuration" type="number" />
      </div>
    </template>
    <template #footer>
      <ButtonPrimary style="width: fit-content" @click="createLink">Créer</ButtonPrimary>
    </template>
  </Modal>

  <div class="entry-container">
    <div class="entry-header">
      <span class="entry-name">
        {{ entry.filename }}
      </span>
      <FileBadge :entry-type="entry.type" class="badge" />
    </div>
    <div class="content" @click="opened = true">
      <img v-if="isImage" class="center-image" :src="contentUrl" width="100%" :alt="entry.filename" />
      <FontAwesomeIcon v-else class="icon" :icon="faImage" />
    </div>
    <div class="action-container">
      <ButtonPrimary class="action" @click="emit('download', entry)"> Télécharger </ButtonPrimary>
      <ButtonPrimary class="action" @click="emit('delete', entry)"> Supprimer </ButtonPrimary>
      <ButtonPrimary class="action" @click="createLinkModalOpened = true">Créer un lien</ButtonPrimary>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, type PropType, ref } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faImage } from '@fortawesome/free-regular-svg-icons';

  import { type FirebaseFile, getFileUrl } from '@/composables/uploadFile';
  import ButtonPrimary from '@/components/ButtonPrimary.vue';
  import Modal from '@/components/Modal.vue';
  import { createLink as postLink } from '@/composables/links';
  import FileBadge from '@/components/FileBadge.vue';

  const props = defineProps({
    entry: {
      type: Object as PropType<FirebaseFile>,
      required: true,
      default: () => ({ filename: 'unknown', type: 'other' }),
    },
  });

  const emit = defineEmits(['delete', 'download']);

  const contentUrl = ref('');
  const opened = ref(false);
  const createLinkModalOpened = ref(false);
  const linkDuration = ref(60);

  const isImage = computed(() => {
    return /\.apng|\.avif|\.gif|\.jpeg|\.jpg|\.png|\.svg|webp/.test(props.entry.filename);
  });

  onBeforeMount(async () => {
    contentUrl.value = await getFileUrl(props.entry);
  });

  const createLink = async () => {
    await postLink(props.entry.url, linkDuration.value);
    createLinkModalOpened.value = false;
  };
</script>

<style scoped lang="scss">
  iframe {
    border: none;
  }

  .center-image {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .entry-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    border-radius: 8px;
    padding: 8px 12px;
    border: 1px solid #ccc;
    background-color: $theme__light__card__bg__color;
    background-clip: border-box;
    box-shadow: 0 1px 2px rgb(56 65 74 / 15%);
    transition: all 0.3s;

    .entry-header {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 8px;

      .badge {
        margin-left: auto;
      }
    }

    .content {
      margin-top: 12px;
      margin-bottom: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .icon {
        font-size: 6rem;
      }

      img {
        max-height: 200px;
      }
    }

    .action-container {
      display: flex;
      gap: 8px;

      .action {
        margin-top: 8px;
      }
    }
  }
</style>
