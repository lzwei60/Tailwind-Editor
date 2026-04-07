<template>
  <component
    :is="node.tag"
    ref="nodeRef"
    class="group transition-all"
    :class="[
      node.class,
      node.tag !== 'select' && node.tag !== 'input' ? 'relative' : '',
      isSelected ? 'ring-2 ring-[var(--editor-accent)] ring-offset-2' : '',
      isDraggingOver && canHaveChildren && dropPosition === 'inside'
        ? 'ring-2 ring-[var(--editor-success)] ring-offset-2'
        : '',
      isThisDragging ? 'opacity-40 scale-95' : '',
      canHaveChildren ? 'min-h-[40px]' : '',
    ]"
    :draggable="true"
    @click.stop="selectNode"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Select 下拉选项 -->
    <template v-if="node.tag === 'select'">
      <option
        v-for="(opt, idx) in node.options"
        :key="idx"
        :class="[
          node.styles.bgColor || 'bg-white',
          node.styles.textColor || 'text-gray-700',
        ]"
      >
        {{ opt }}
      </option>
    </template>

    <!-- Checkbox 组件 -->
    <template v-else-if="node.inputType === 'checkbox'">
      <input
        type="checkbox"
        class="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500 pointer-events-none"
        :checked="node.checked"
      />
      <span v-if="node.text">{{ node.text }}</span>
    </template>

    <!-- 文本内容 -->
    <span v-else-if="node.text" class="pointer-events-none">{{
      node.text
    }}</span>

    <!-- 子节点 -->
    <NodeRenderer
      v-for="child in node.children"
      :key="child.id"
      :node="child"
    />

    <!-- 空容器占位 -->
    <div
      v-if="canHaveChildren && !node.children.length && !node.text"
      class="text-[var(--editor-text-muted)] text-xs py-2 text-center border border-dashed border-[var(--editor-border)] rounded m-1"
    >
      空容器 · 拖入节点
    </div>

    <!-- 拖拽放置提示（放入容器内） -->
    <div
      v-if="isDraggingOver && canHaveChildren && dropPosition === 'inside'"
      class="absolute inset-0 bg-[var(--editor-success-light)] bg-opacity-50 pointer-events-none flex items-center justify-center rounded"
    >
      <span
        class="text-xs text-[var(--editor-success)] font-medium bg-white px-2 py-1 rounded shadow-sm"
      >
        放入容器
      </span>
    </div>
  </component>

  <!-- 拖拽位置指示器 - 更明显的样式 -->
  <div v-if="showDropIndicator" class="pointer-events-none">
    <div
      class="h-1 bg-[var(--editor-accent)] rounded-full shadow-lg"
      :style="
        dropPosition === 'before'
          ? 'margin-top: -2px; margin-bottom: 4px;'
          : 'margin-top: 4px;'
      "
    ></div>
    <div
      v-if="dropPosition === 'before'"
      class="w-2 h-2 bg-[var(--editor-accent)] rounded-full -mt-1.5 ml-0"
    ></div>
    <div
      v-else
      class="w-2 h-2 bg-[var(--editor-accent)] rounded-full -mt-1.5 ml-0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { editorStore } from "@/store/editor";
import type { EditorNode, DropPosition } from "@/store/editor";

const props = defineProps<{
  node: EditorNode;
}>();

const isSelected = computed(() => editorStore.selectedId === props.node.id);
const isThisDragging = computed(() => editorStore.dragNodeId === props.node.id);

// 可以有子节点的组件
const canHaveChildren = computed(() => {
  return [
    "div",
    "section",
    "article",
    "main",
    "header",
    "footer",
    "card",
  ].includes(props.node.tag);
});

// 使用全局拖拽状态
const isDraggingOver = computed(
  () => editorStore.dragOverNodeId === props.node.id
);
const dropPosition = computed(() => editorStore.dragDropPosition);

// 是否显示拖拽位置指示器
const showDropIndicator = computed(() => {
  return (
    isDraggingOver.value &&
    dropPosition.value !== null &&
    dropPosition.value !== "inside"
  );
});

function selectNode() {
  editorStore.selectedId = props.node.id;
}

function onDragStart(e: DragEvent) {
  // 阻止事件冒泡，防止父容器也触发 dragstart
  e.stopPropagation();

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
  e.stopPropagation();

  // 如果是当前拖拽的节点，不处理
  if (editorStore.dragNodeId === props.node.id) return;

  // 检查是否是新组件拖拽（从组件面板拖入）
  const isNewComponent = !!editorStore.dragNewComponentType;

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const y = e.clientY;
  const height = rect.height;
  const relativeY = y - rect.top;

  let position: DropPosition | "inside";

  // 对于非容器元素，只需要判断前后位置
  if (!canHaveChildren.value) {
    // 非容器元素：上半部分 = before，下半部分 = after
    if (relativeY <= height * 0.5) {
      position = "before";
    } else {
      position = "after";
    }
  } else {
    // 容器元素：判断放置位置
    // 上25% = before，中间50% = inside，下25% = after
    if (relativeY < height * 0.25) {
      position = "before";
    } else if (relativeY > height * 0.75) {
      position = "after";
    } else {
      position = "inside";
    }
  }

  // 更新全局拖拽状态
  editorStore.setDragOver(props.node.id, position);

  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = isNewComponent ? "copy" : "move";
  }
}

function onDragLeave(e: DragEvent) {
  // 检查是否真的离开了元素
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  if (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  ) {
    // 只有当前是这个节点的拖拽状态时才清除
    if (editorStore.dragOverNodeId === props.node.id) {
      editorStore.setDragOver(null, null);
    }
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();

  const position = editorStore.dragDropPosition;

  // 检查是否是新组件拖拽
  const newComponentType =
    e.dataTransfer?.getData("application/x-new-component") ||
    editorStore.dragNewComponentType;

  if (newComponentType) {
    // 新组件拖拽：在指定位置添加新节点
    if (position) {
      editorStore.addNodeAt(newComponentType, props.node.id, position);
    }
    editorStore.setDragNewComponent(null);
    editorStore.setDragOver(null, null);
    return;
  }

  // 已有节点拖拽
  const dragId =
    e.dataTransfer?.getData("text/plain") || editorStore.dragNodeId;
  if (!dragId || dragId === props.node.id) {
    editorStore.setDragOver(null, null);
    return;
  }

  if (position) {
    if (position === "inside") {
      editorStore.moveNode(dragId, props.node.id, "inside");
    } else {
      editorStore.moveNode(dragId, props.node.id, position as DropPosition);
    }
    editorStore.setDragNode(null);
  }

  editorStore.setDragOver(null, null);
}
</script>
