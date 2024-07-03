<template>
  <ButtonBase background-color="#8ab4f8" hover-bg-color="#6a9ff5" border-radius="6px" border-size="1px" border-color="#8ab4f8">
    <slot />
  </ButtonBase>
</template>

<script setup lang="ts">
  import ButtonBase from '@/components/ButtonBase.vue';
</script>
