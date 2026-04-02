<template>
  <div class="h-screen flex flex-col bg-white dark:bg-slate-900">
    <!-- 顶部工具栏 -->
    <header
      class="h-14 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900"
    >
      <!-- 左侧品牌 -->
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center"
        >
          <svg
            class="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        </div>
        <span class="font-medium text-gray-900 dark:text-white text-sm"
          >Tailwind 可视化编辑器</span
        >
      </div>

      <!-- 中央按钮 -->
      <div class="flex items-center gap-2">
        <button
          class="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center gap-1.5 transition-colors"
          @click="handlePreview"
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          预览
        </button>
        <button
          class="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          @click="handleCopyHtml"
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
          复制 HTML
        </button>
        <button
          class="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          @click="handleCopyClasses"
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
          复制 class
        </button>
        <button
          class="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          @click="showSaveTemplateDialog"
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          保存为模板
        </button>
        <!-- 保存模板对话框 -->
        <Teleport to="body">
          <div
            v-if="showSaveDialog"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            @click.self="showSaveDialog = false"
          >
            <div
              class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-80"
            >
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
              >
                保存为模板
              </h3>
              <input
                v-model="templateName"
                type="text"
                placeholder="请输入模板名称"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                @keyup.enter="handleSaveTemplate"
              />
              <div class="flex justify-end gap-2 mt-4">
                <button
                  class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  @click="showSaveDialog = false"
                >
                  取消
                </button>
                <button
                  class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  @click="handleSaveTemplate"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </Teleport>
        <!-- 提示消息 -->
        <Transition name="fade">
          <span
            v-if="toastMessage"
            class="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white text-sm rounded-lg shadow-lg z-50"
          >
            {{ toastMessage }}
          </span>
        </Transition>
      </div>

      <!-- 右侧模式选择 -->
      <div class="flex items-center gap-2">
        <!-- <div
          class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          <span class="text-gray-700 dark:text-gray-300 text-sm">
            Tailwind CDN 模式
          </span>
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
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
        </div> -->
        <UndoRedo />
        <ThemeToggle />
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧边栏 -->
      <aside
        class="w-72 border-r border-gray-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900"
      >
        <ComponentPanel
          class="flex-[2] overflow-y-auto border-b border-gray-200 dark:border-slate-800"
        />
        <TreePanel class="flex-1 overflow-y-auto" />
      </aside>

      <!-- 中间画布 -->
      <main class="flex-1 overflow-auto bg-gray-100 dark:bg-slate-800">
        <div class="p-6 min-h-full">
          <div
            class="bg-white dark:bg-slate-900 rounded-lg shadow-xl min-h-[500px] p-6"
          >
            <Canvas />
          </div>
        </div>
      </main>

      <!-- 右侧边栏 -->
      <aside
        class="w-80 border-l border-gray-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto"
      >
        <StylePanel />
        <ClassPreview />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ComponentPanel from "@/components/ComponentPanel.vue";
import TreePanel from "@/components/TreePanel.vue";
import Canvas from "@/components/Canvas.vue";
import StylePanel from "@/components/StylePanel.vue";
import ClassPreview from "@/components/ClassPreview.vue";
import UndoRedo from "@/components/UndoRedo.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
import { editorStore } from "@/store/editor";

const toastMessage = ref("");

function showToast(message: string) {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
}

function handlePreview() {
  if (!editorStore.nodes.length) {
    showToast("没有内容可预览");
    return;
  }
  const html = editorStore.generateHtml();
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

async function handleCopyHtml() {
  if (!editorStore.nodes.length) {
    showToast("没有内容可复制");
    return;
  }
  const html = editorStore.generateHtml();
  await navigator.clipboard.writeText(html);
  showToast("HTML 已复制到剪贴板");
}

async function handleCopyClasses() {
  if (!editorStore.nodes.length) {
    showToast("没有内容可复制");
    return;
  }
  const classes = editorStore.generateAllClasses();
  await navigator.clipboard.writeText(classes);
  showToast("Class 已复制到剪贴板");
}

// 保存模板相关
const showSaveDialog = ref(false);
const templateName = ref("");

function showSaveTemplateDialog() {
  if (!editorStore.nodes.length) {
    showToast("没有内容可保存");
    return;
  }
  templateName.value = "";
  showSaveDialog.value = true;
}

function handleSaveTemplate() {
  const name = templateName.value.trim();
  if (!name) {
    showToast("请输入模板名称");
    return;
  }

  const success = editorStore.saveAsTemplate(name);
  if (success) {
    showToast("模板保存成功");
    showSaveDialog.value = false;
    templateName.value = "";
    // 刷新自定义模板列表
    editorStore.customTemplates = editorStore.getCustomTemplates();
  } else {
    showToast("保存失败");
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
