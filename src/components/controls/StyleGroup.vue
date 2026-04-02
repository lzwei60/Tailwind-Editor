<template>
  <div class="border border-[var(--editor-border)] rounded-lg overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[var(--editor-text)] bg-[var(--editor-surface)] hover:bg-[var(--editor-border)] transition-colors"
      @click="toggle"
    >
      <span>{{ title }}</span>
      <svg
        class="w-3.5 h-3.5 transition-transform duration-200"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    <div v-show="isExpanded" class="p-3 space-y-3 bg-[var(--editor-bg)]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  title: string;
  expanded?: boolean;
}>();

const isExpanded = ref(props.expanded ?? false);

function toggle() {
  isExpanded.value = !isExpanded.value;
}

watch(
  () => props.expanded,
  (val) => {
    if (val !== undefined) {
      isExpanded.value = val;
    }
  }
);
</script>
