<template>
  <div class="flex flex-col">
    <h3
      class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 flex-shrink-0"
    >
      DOM 树
    </h3>
    <div class="px-2 pb-4 flex-1 overflow-y-auto">
      <ul v-if="editorStore.nodes.length" class="text-sm">
        <TreeNode
          v-for="node in editorStore.nodes"
          :key="node.id"
          :node="node"
        />
      </ul>
      <div
        v-else
        class="text-xs text-gray-400 dark:text-gray-500 py-4 text-center"
      >
        暂无节点
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { editorStore } from "@/store/editor";
import TreeNode from "@/components/TreeNode.vue";
</script>
