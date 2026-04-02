<template>
  <div class="flex items-center gap-1">
    <button
      class="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      :disabled="!editorStore.canUndo"
      @click="editorStore.undo()"
      title="撤销 (Ctrl+Z)"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    </button>
    <button
      class="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      :disabled="!editorStore.canRedo"
      @click="editorStore.redo()"
      title="重做 (Ctrl+Shift+Z)"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
        />
      </svg>
    </button>
    <span class="text-xs text-gray-400 dark:text-gray-500 ml-1 tabular-nums">
      {{ historyInfo }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { editorStore } from "@/store/editor";

const historyInfo = computed(() => {
  const current = editorStore.historyIndex + 1;
  const total = editorStore.history.length;
  return `${current}/${total}`;
});

function handleKeydown(e: KeyboardEvent) {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

  if (ctrlKey && e.key === "z") {
    e.preventDefault();
    if (e.shiftKey) {
      editorStore.redo();
    } else {
      editorStore.undo();
    }
  }

  if (ctrlKey && e.key === "y") {
    e.preventDefault();
    editorStore.redo();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  editorStore.initHistory();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
