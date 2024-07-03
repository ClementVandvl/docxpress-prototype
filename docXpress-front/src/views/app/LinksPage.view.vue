<template>
  <div>
    <h1>Links</h1>
    <div v-if="links?.length" class="link-wrapper">
      <div v-for="link in links" :key="link.filename" class="mt-4 link-container">
        <div class="d-flex gap-2 mb-1">
          <FontAwesomeIcon class="copy-icon" :icon="faCopy" @click="copyLink(link)" />
          <h3>
            {{ link.filename }}
          </h3>
          <FileBadge :entry-type="link.type" />
          <a :href="link.targetUrl" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon :icon="faShare" />
          </a>
        </div>
        <span>
          Expire le
          {{
            new Date(link.expirationTime).toLocaleString(undefined, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          }}
        </span>
      </div>
    </div>
    <div v-else class="mt-4">
      <p>Aucun lien pour le moment</p>
    </div>
    <ButtonPrimary class="mt-4" style="width: fit-content" @click="getLinks">Rafraîchir</ButtonPrimary>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faCopy, faShare } from '@fortawesome/free-solid-svg-icons';

  import { type EphemeralLinkModel, getWorkingEphemerallinks } from '@/composables/links';
  import ButtonPrimary from '@/components/ButtonPrimary.vue';
  import { type FirebaseFile, getFiles } from '@/composables/uploadFile';
  import FileBadge from '@/components/FileBadge.vue';

  const links = ref<(EphemeralLinkModel & FirebaseFile)[]>([]);

  const getLinks = async () => {
    const workingLinks = await getWorkingEphemerallinks();
    const allFiles = await getFiles(['id_card', 'passport', 'other']);
    links.value = workingLinks
      .map((link: EphemeralLinkModel): (EphemeralLinkModel & FirebaseFile) | undefined => {
        const file = allFiles.find(f => f.url === link.targetUrl);
        if (!file) return undefined;
        return {
          ...file,
          ...link,
        };
      })
      .filter((file: (FirebaseFile & EphemeralLinkModel) | undefined): file is FirebaseFile & EphemeralLinkModel => file !== undefined);
  };

  async function copyToClipboard(textToCopy: string) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
  }

  const copyLink = (link: FirebaseFile & EphemeralLinkModel) => {
    copyToClipboard('http://62.72.19.90:3000/' + link.linkId);
  };

  onBeforeMount(() => {
    getLinks();
  });
</script>

<style scoped lang="scss">
  .link-wrapper {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

    .link-container {
      border-radius: 8px;
      background-color: white;
      border: 2px solid black;
      padding: 8px 16px;
    }

    .copy-icon {
      cursor: pointer;

      &:hover {
        color: #7cacf8;
      }
    }
  }
</style>
