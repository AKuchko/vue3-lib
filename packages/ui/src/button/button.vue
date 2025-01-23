<template>
  <button>Test Button</button>
</template>

<script lang="ts" setup>
import { defineOptions } from 'vue';

interface ButtonProps {
  disabled?: boolean,
};

defineOptions({
  name: 'ak-button',
});

defineProps<ButtonProps>();
</script>
