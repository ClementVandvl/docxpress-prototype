<template>
  <div class="button-base">
    <slot />
  </div>
</template>

<script setup lang="ts">
  defineProps({
    backgroundColor: {
      type: String,
      required: false,
      default: 'white',
    },
    borderRadius: {
      type: String,
      default: 'none',
    },
    borderSize: {
      type: String,
      default: '2px',
    },
    borderColor: {
      type: String,
      default: '#222222',
    },
    borderType: {
      type: String,
      default: 'solid',
    },
    baseTextColor: {
      type: String,
      default: '#1C1C1C',
    },
    hoverBgColor: {
      type: String,
      default: '#F0F0F0',
    },
    hoverTextColor: {
      type: String,
      default: '#1C1C1C',
    },
    disabledBgColor: {
      type: String,
      default: '#C0C0C0',
    },
    disabledTextColor: {
      type: String,
      default: '#222222',
    },
  });
</script>

<style scoped lang="scss">
  .button-base {
    color: v-bind(baseTextColor);
    background-color: v-bind(backgroundColor);
    border-radius: v-bind(borderRadius);
    border: v-bind(borderSize) v-bind(borderType) v-bind(borderColor);
    padding: 0.3rem 1.3rem;
    cursor: pointer;

    &:hover {
      color: v-bind(hoverTextColor);
      background-color: v-bind(hoverBgColor);
    }

    &:disabled {
      color: v-bind(disabledTextColor);
      background-color: v-bind(disabledBgColor);
      cursor: not-allowed;
    }
  }
</style>
