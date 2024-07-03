<template>
  <RouterLink class="nav-link" :to :class="{ 'is-current-route': isCurrentRoute }">
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, type PropType } from 'vue';

  const props = defineProps({
    to: {
      type: Object as PropType<{
        name: string;
        query?: Record<string, string>;
      }>,
      required: true,
    },
  });

  const route = useRoute();

  const isCurrentRoute = computed(() => {
    return route.name === props.to.name && (!props.to.query || JSON.stringify(route.query) === JSON.stringify(props.to.query));
  });
</script>

<style scoped lang="scss">
  .nav-link {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
    margin: 8px 20px;
    color: white;
    font-weight: 600;
    position: relative;
    opacity: 0.6;

    &.is-current-route {
      opacity: 1;
    }

    &:hover {
      cursor: pointer;
      opacity: 1;
      color: white;
    }
  }
</style>
