<template>
  <div class="p-4 border-t border-gray-200 dark:border-slate-800">
    <h3
      class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
    >
      Class 类名
    </h3>
    <div v-if="selectedNode">
      <code
        class="block bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 break-all leading-relaxed"
      >
        {{ selectedNode.class }}
      </code>
      <button
        class="w-full mt-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        @click="copyClass"
        title="复制 Class"
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
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        复制
      </button>
    </div>
    <div
      v-else
      class="text-xs text-gray-400 dark:text-gray-500 py-4 text-center"
    >
      未选中组件
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { editorStore } from "@/store/editor";

const selectedNode = computed(() => {
  if (!editorStore.selectedId) return null;
  return editorStore.findNode(editorStore.nodes, editorStore.selectedId);
});

function copyClass() {
  if (selectedNode.value) {
    navigator.clipboard.writeText(selectedNode.value.class);
  }
}
</script>
