<template>
  <div
    ref="canvasRef"
    class="min-h-full py-2 flex flex-col"
    @dragenter.prevent="onRootDragEnter"
    @dragover.prevent="onRootDragOver"
    @dragleave="onDragLeave"
    @drop.prevent.stop="onRootDrop"
  >
    <!-- 节点列表 -->
    <div
      v-if="editorStore.nodes.length"
      class="space-y-2 flex-1"
      @dragenter.prevent="onRootDragEnter"
      @dragover.prevent="onRootDragOver"
    >
      <NodeRenderer
        v-for="node in editorStore.nodes"
        :key="node.id"
        :node="node"
      />
    </div>

    <!-- 空状态提示 -->
    <div
      v-else
      class="text-[var(--editor-text-muted)] text-sm py-12 text-center border-2 border-dashed border-[var(--editor-border)] rounded-lg flex-1 min-h-[200px]"
      :class="{
        'border-[var(--editor-accent)] bg-[var(--editor-accent-light)]':
          isDragOver,
      }"
      @dragenter.prevent="isDragOver = true"
      @dragover.prevent
      @drop.prevent.stop="onEmptyDrop"
    >
      <svg
        class="w-12 h-12 mx-auto mb-3 opacity-40 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      <span class="pointer-events-none">{{
        isDragOver ? "释放以添加组件" : "从左侧拖入组件开始设计"
      }}</span>
    </div>

    <!-- 底部拖放区域 - 始终存在但只在拖拽时可见 -->
    <div
      v-if="showDropZone"
      class="h-20 border-2 border-dashed border-[var(--editor-accent)] bg-[var(--editor-accent-light)] rounded-lg flex items-center justify-center text-[var(--editor-accent)] text-sm font-medium mt-2 cursor-pointer"
      @dragover.prevent
      @drop.prevent.stop="onDropZoneDrop"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
      释放以添加到末尾
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { editorStore } from "@/store/editor";
import NodeRenderer from "@/components/NodeRenderer.vue";

const canvasRef = ref<HTMLElement | null>(null);
const isDragOver = ref(false);

// 显示放置区域（仅当有节点时显示底部拖放区域）
const showDropZone = computed(() => {
  return (
    isDragOver.value &&
    editorStore.nodes.length > 0 &&
    (!!editorStore.dragNodeId || !!editorStore.dragNewComponentType)
  );
});

function onRootDragEnter(e: DragEvent) {
  // 检查 dataTransfer 中是否有新组件类型
  const newComponentType =
    e.dataTransfer?.types.includes("application/x-new-component") ||
    !!editorStore.dragNewComponentType;
  const hasDragNode = !!editorStore.dragNodeId;

  if (newComponentType || hasDragNode) {
    isDragOver.value = true;
  }
}

function onRootDragOver(e: DragEvent) {
  // 检查 dataTransfer 中是否有新组件类型或节点数据
  const hasNewComponent =
    e.dataTransfer?.types.includes("application/x-new-component") ||
    !!editorStore.dragNewComponentType;
  const hasDragNode = !!editorStore.dragNodeId;

  if (hasNewComponent || hasDragNode) {
    isDragOver.value = true;
  }
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = hasNewComponent ? "copy" : "move";
  }
}

function onDragLeave(e: DragEvent) {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (rect) {
    // 检查是否真的离开了画布
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      isDragOver.value = false;
    }
  }
}

// 空状态时拖放处理
function onEmptyDrop(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;

  // 检查是否是新组件拖拽
  const newComponentType =
    e.dataTransfer?.getData("application/x-new-component") ||
    editorStore.dragNewComponentType;

  if (newComponentType) {
    editorStore.addNodeAt(newComponentType, null, "inside");
    editorStore.setDragNewComponent(null);
    return;
  }

  // 已有节点拖拽
  const dragId =
    e.dataTransfer?.getData("text/plain") || editorStore.dragNodeId;
  if (dragId) {
    editorStore.moveNodeToRoot(dragId);
    editorStore.setDragNode(null);
  }
}

function onRootDrop(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;

  // 检查是否是新组件拖拽
  const newComponentType =
    e.dataTransfer?.getData("application/x-new-component") ||
    editorStore.dragNewComponentType;

  if (newComponentType) {
    // 检查是否拖到了某个节点上（由 NodeRenderer 处理）
    const target = e.target as HTMLElement;
    const droppedOnNode = target.closest('[draggable="true"]');

    // 如果没有拖到节点上，添加到根级别末尾
    if (!droppedOnNode) {
      editorStore.addNodeAt(newComponentType, null, "inside");
    }
    editorStore.setDragNewComponent(null);
    return;
  }

  const dragId =
    e.dataTransfer?.getData("text/plain") || editorStore.dragNodeId;
  if (!dragId) return;

  // 检查是否拖到了某个节点上（由 NodeRenderer 处理）
  const target = e.target as HTMLElement;
  const droppedOnNode = target.closest('[draggable="true"]');

  // 如果没有拖到节点上，则移动到根级别
  if (!droppedOnNode) {
    editorStore.moveNodeToRoot(dragId);
    editorStore.setDragNode(null);
  }
}

// 底部放置区域的 drop 处理
function onDropZoneDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDragOver.value = false;

  // 检查是否是新组件拖拽
  const newComponentType =
    e.dataTransfer?.getData("application/x-new-component") ||
    editorStore.dragNewComponentType;

  if (newComponentType) {
    editorStore.addNodeAt(newComponentType, null, "inside");
    editorStore.setDragNewComponent(null);
    return;
  }

  const dragId =
    e.dataTransfer?.getData("text/plain") || editorStore.dragNodeId;
  if (!dragId) return;

  editorStore.moveNodeToRoot(dragId);
  editorStore.setDragNode(null);
}

// 清理状态
function onGlobalDragEnd() {
  isDragOver.value = false;
  // 确保全局拖拽状态被清除
  editorStore.setDragNode(null);
  editorStore.setDragNewComponent(null);
}

onMounted(() => {
  document.addEventListener("dragend", onGlobalDragEnd);
});

onUnmounted(() => {
  document.removeEventListener("dragend", onGlobalDragEnd);
});
</script>
