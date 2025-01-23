<template>
  <button
    class="ak-button"
    :class="classes"
    :disabled="props.disabled"
    :aria-disabled="props.disabled"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script lang="ts" setup>
import './style/index.scss';
import { defineOptions, computed } from 'vue';

defineOptions({
  name: 'ak-button',
});

interface ButtonProps {
  label?: string,
  type?: 'button' | 'submit',
  disabled?: boolean,
};

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
});

const classes = computed(() => ({
  'ak-button--disabled': props.disabled,
}));
</script>
