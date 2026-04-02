<template>
  <div>
    <label class="text-xs text-[var(--editor-text-muted)] block mb-1.5">{{
      label
    }}</label>
    <select :value="modelValue" @change="onChange" class="form-select">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string;
  value: string;
}

const props = defineProps<{
  label: string;
  modelValue: string;
  options: Option[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function onChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
}
</script>
