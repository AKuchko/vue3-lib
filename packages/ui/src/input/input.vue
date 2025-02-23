<script lang="ts" setup>
import { computed, defineOptions } from 'vue';
import './style/index.scss';

defineOptions({
  name: 'ak-input',
});

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'date' | 'time',
  disabled?: boolean,
  readOnly?: boolean,
  invalid?: boolean,
  autocomplete?: string,
  name?: string,
  id?: string,
};

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off',
});

const model = defineModel<string>();

const classes = computed(() => ({
  'ak-input--disabled': props.disabled,
  'ak-input--invalid': props.invalid,
  'ak-input--read-only': props.readOnly,
  'ak-input--filled': model.value && model.value.length,
}));
</script>

<template>
  <input
    v-model="model"
    :id="props.id"
    class="ak-input"
    :class="classes"
    :type="props.type"
    :disabled="props.disabled"
    :aria-disabled="props.disabled"
    :read-only="props.readOnly"
    :aria-readonly="props.readOnly"
    :autocomplete="props.autocomplete"
    :name="props.name"
    :aria-invalid="props.invalid"
  >
</template>
