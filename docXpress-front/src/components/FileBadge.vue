<template>
  <div class="badge">
    {{ badgeColor.label }}
  </div>
</template>

<script setup lang="ts">
  import { computed, type PropType } from 'vue';

  import type { FileType } from '@/composables/uploadFile';

  const props = defineProps({
    entryType: {
      type: Object as PropType<FileType>,
      required: true,
    },
  });

  const badgeColor = computed(() => {
    switch (props.entryType) {
      case 'id_card':
        return {
          textColor: '#003f5a',
          backgroundColor: 'rgba(41,156,219,.1)',
          label: 'CNI',
        };
      case 'passport':
        return {
          textColor: '#0ab39c',
          backgroundColor: 'rgba(10,179,156,.1)',
          label: 'Passport',
        };
      default:
        return {
          textColor: '#f7b84b',
          backgroundColor: 'rgba(240, 219, 175, 0.1)',
          label: 'Autre',
        };
    }
  });

  const badgeBackgroundColor = computed(() => {
    return badgeColor.value.backgroundColor;
  });
  const badgeTextColor = computed(() => {
    return badgeColor.value.textColor;
  });
</script>

<style scoped lang="scss">
  .badge {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: bold;
    color: v-bind(badgeTextColor);
    background-color: v-bind(badgeBackgroundColor);
  }
</style>
