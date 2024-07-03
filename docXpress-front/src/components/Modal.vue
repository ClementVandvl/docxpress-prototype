<template>
  <Teleport to="body">
    <div>
      <Transition name="modal-transition" :class="transition" :duration="500">
        <div v-if="show" :class="{ 'modal-overlay': true, fullscreen }" @click.self="closeModal">
          <div :class="{ 'modal': true, 'persistent-animation': persistentAnimation }">
            <div v-if="hasHeader" class="modal-header">
              <slot name="header" />
            </div>
            <div v-if="hasBody" class="modal-body">
              <slot />
            </div>
            <div v-if="hasFooter" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { computed, type PropType, ref, useSlots, watch } from 'vue';

  type ModalTransition = 'fade-in-down' | 'fade-in-up' | 'zoom-in';

  const useHasSlot = (name?: string): boolean => {
    const slots = useSlots();

    if (name === undefined) {
      return useHasSlot('default');
    }
    return slots[name] !== null && slots[name] !== undefined;
  };

  enum FlexLocation {
    top = 'flex-start',
    center = 'center',
    bottom = 'flex-end',
  }
  const props = defineProps({
    modelValue: {
      required: true,
      type: Boolean,
    },
    position: {
      type: String as PropType<keyof typeof FlexLocation>,
      default: 'top',
    },
    borderRadius: {
      type: String,
      default: '.3em',
    },
    backgroundColor: {
      type: String,
      default: 'white',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: 'fit-content',
    },
    height: {
      type: String,
      default: 'fit-content',
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    transition: {
      type: String as PropType<ModalTransition>,
      default: 'fade-in-down',
    },
  });

  const emits = defineEmits(['update:modelValue']);

  const show = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emits('update:modelValue', value);
    },
  });

  const persistentAnimation = ref<boolean>(false);

  const hasHeader = computed(() => {
    return useHasSlot('header');
  });

  const hasBody = computed(() => {
    return useHasSlot('default');
  });

  const hasFooter = computed(() => {
    return useHasSlot('footer');
  });

  const position = computed<string>(() => FlexLocation[props.position]);

  const closeModal = () => {
    if (persistentAnimation.value) return;
    if (!props.persistent) show.value = false;
    else {
      persistentAnimation.value = true;
      setTimeout(() => (persistentAnimation.value = false), 400);
    }
  };

  watch(
    () => show.value,
    value => {
      if (value) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto';
    },
  );
</script>

<style lang="scss" scoped>
  @keyframes persistent-scaling {
    0% {
      transform: scale(1);
    }

    70% {
      transform: scale(1.02);
    }

    100% {
      transform: scale(1);
    }
  }

  .modal-transition-enter-active {
    transition: all 0.2s ease-in-out;

    & > .modal {
      transition: all 0.3s ease-out 0.2s;
    }

    &.zoom-in > .modal {
      transition: all 0.3s ease 0.2s;
    }
  }

  .modal-transition-leave-active {
    transition: all 0.2s ease-in-out 0.2s;

    & > .modal {
      transition: all 0.3s ease-out;
    }

    &.zoom-in > .modal {
      transition: all 0.3s ease;
    }
  }

  .modal-transition-enter-from,
  .modal-transition-leave-to {
    opacity: 0;

    & > .modal {
      opacity: 0;
    }

    &.fade-in-down > .modal {
      transform: translateY(-3rem);
    }

    &.fade-in-up > .modal {
      transform: translateY(3rem);
    }

    &.zoom-in > .modal {
      transform: scale(0.7);
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: v-bind('position');
    padding: 1.75rem 1.75rem;

    .modal {
      display: flex;
      flex-direction: column;
      border-radius: v-bind('borderRadius');
      background-color: v-bind('backgroundColor');
      height: v-bind('height');
      width: v-bind('width');
      max-height: 100%;
      max-width: 100%;

      &.modal.persistent-animation {
        animation: persistent-scaling 0.4s ease-out;
      }

      .modal-header {
        padding: 1.25rem;
        padding-bottom: 0;
      }

      .modal-body {
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 1.25rem;
      }

      .modal-footer {
        padding: 1.25rem;
        padding-top: 0;
      }
    }

    &.fullscreen {
      padding: 0;

      .modal {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
