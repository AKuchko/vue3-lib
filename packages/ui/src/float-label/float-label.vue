<script setup lang="ts">
import './style/index.scss';
import { defineOptions } from 'vue';

defineOptions({
  name: 'ak-float-label',
});

interface FloatLabelProps {
  label?: string,
};

const props = defineProps<FloatLabelProps>();
</script>

<template>
  <label class="ak-float-label">
    <span class="ak-float-label__label">
      {{ props.label }}
    </span>
    <slot />
  </label>
</template>
