<template>
  <li>
    <div
      class="group relative flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors"
      :class="[
        isSelected
          ? 'bg-purple-600/20 text-purple-500 dark:text-purple-400'
          : 'hover:bg-gray-100 dark:hover:bg-slate-800',
        isDraggingOver && dropPosition === 'inside' ? 'bg-green-600/20' : '',
        isThisDragging ? 'opacity-40' : '',
      ]"
      :draggable="true"
      @click.stop="select"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <!-- 上方放置指示线 -->
      <div
        v-if="isDraggingOver && dropPosition === 'before'"
        class="absolute -top-0.5 left-2 right-0 h-0.5 bg-purple-500 rounded-full"
      />

      <!-- 展开图标 -->
      <span
        class="w-3.5 h-3.5 flex items-center justify-center"
        :class="node.children.length ? '' : 'invisible'"
      >
        <svg
          class="w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform"
          :class="isExpanded ? 'rotate-90' : ''"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          @click.stop="toggleExpand"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>

      <!-- 节点图标 -->
      <svg
        class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
        />
      </svg>

      <!-- 节点名称 -->
      <span class="flex-1 truncate text-xs">
        <span class="text-gray-700 dark:text-gray-300">{{ nodeLabel }}</span>
        <span
          v-if="node.text"
          class="text-gray-400 dark:text-gray-500 ml-1 truncate max-w-[80px]"
          >"{{ node.text }}"</span
        >
      </span>

      <!-- 子节点数量 -->
      <span
        v-if="node.children.length"
        class="text-[10px] text-gray-500 bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full"
      >
        {{ node.children.length }}
      </span>

      <!-- 删除按钮 -->
      <button
        class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-600/20 hover:text-red-400 transition-all text-gray-400 dark:text-gray-500"
        @click.stop="deleteNode"
        title="删除"
      >
        <svg
          class="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- 下方放置指示线 -->
      <div
        v-if="isDraggingOver && dropPosition === 'after'"
        class="absolute -bottom-0.5 left-2 right-0 h-0.5 bg-purple-500 rounded-full"
      />
    </div>

    <ul
      v-show="isExpanded && node.children.length"
      class="ml-4 border-l border-gray-200 dark:border-slate-700 pl-1"
    >
      <TreeNode v-for="child in node.children" :key="child.id" :node="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { editorStore } from "@/store/editor";
import type { EditorNode, DropPosition } from "@/store/editor";

const props = defineProps<{ node: EditorNode }>();

const isSelected = computed(() => editorStore.selectedId === props.node.id);
const isThisDragging = computed(() => editorStore.dragNodeId === props.node.id);

// 节点显示名称
const nodeLabel = computed(() => {
  const tagNames: Record<string, string> = {
    div: "容器",
    button: "按钮",
    p: "文本",
    h1: "标题1",
    h2: "标题2",
    h3: "标题3",
    span: "标签",
    img: "图片",
    input: "输入框",
    hr: "分割线",
  };
  return tagNames[props.node.tag] || props.node.tag;
});

// 使用全局拖拽状态
const isDraggingOver = computed(
  () => editorStore.dragOverNodeId === props.node.id
);
const dropPosition = computed(() => editorStore.dragDropPosition);
const isExpanded = ref(true);

function select() {
  editorStore.selectedId = props.node.id;
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function deleteNode() {
  editorStore.deleteNode(props.node.id);
}

function onDragStart(e: DragEvent) {
  editorStore.setDragNode(props.node.id);
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", props.node.id);
  }
}

function onDragEnd() {
  editorStore.setDragNode(null);
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  if (editorStore.dragNodeId === props.node.id) return;

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const y = e.clientY - rect.top;
  const height = rect.height;

  let position: DropPosition | "inside";
  if (y < height * 0.25) {
    position = "before";
  } else if (y > height * 0.75) {
    position = "after";
  } else {
    position = "inside";
  }

  // 更新全局拖拽状态
  editorStore.setDragOver(props.node.id, position);

  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
}

function onDragLeave() {
  // 只有当前是这个节点的拖拽状态时才清除
  if (editorStore.dragOverNodeId === props.node.id) {
    editorStore.setDragOver(null, null);
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault();

  const dragId =
    e.dataTransfer?.getData("text/plain") || editorStore.dragNodeId;
  if (!dragId || dragId === props.node.id) {
    editorStore.setDragOver(null, null);
    return;
  }

  const position = editorStore.dragDropPosition as DropPosition;
  editorStore.moveNode(dragId, props.node.id, position);
  editorStore.setDragNode(null);
  editorStore.setDragOver(null, null);
}
</script>
