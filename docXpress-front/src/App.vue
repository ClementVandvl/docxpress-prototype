<template>
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
</script>

<style lang="scss">
  body {
    color: $text__color; // Enable scss files to be compiled
  }
</style>
