<template>
  <div class="p-4 flex flex-col">
    <!-- 组件区域 -->
    <div class="mb-6">
      <h3
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
      >
        组件
      </h3>

      <!-- 搜索框 -->
      <div class="relative mb-3">
        <svg
          class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索组件..."
          class="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      <!-- 基础组件标签 -->
      <p class="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
        基础组件
      </p>

      <!-- 组件网格 -->
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="comp in filteredComponents"
          :key="comp.type"
          class="p-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing"
          :draggable="true"
          @click="addComponent(comp.type)"
          @dragstart="onComponentDragStart($event, comp.type)"
          @dragend="onComponentDragEnd"
        >
          <div
            class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            <component :is="comp.icon" class="w-5 h-5" />
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-300">{{
            comp.label
          }}</span>
        </button>
      </div>
    </div>

    <!-- 布局区域 -->
    <div class="mb-6">
      <h3
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
      >
        布局
      </h3>

      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="layout in layouts"
          :key="layout.type"
          class="p-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors flex flex-col items-center gap-1.5"
          @click="addComponent(layout.type)"
        >
          <div
            class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            <component :is="layout.icon" class="w-5 h-5" />
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-300">{{
            layout.label
          }}</span>
        </button>
      </div>
    </div>

    <!-- 常用模板 -->
    <div>
      <h3
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
      >
        常用模板
      </h3>

      <div class="space-y-2">
        <button
          v-for="template in templates"
          :key="template.id"
          class="w-full p-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors flex items-center gap-3"
          @click="addTemplate(template.id)"
        >
          <div
            class="w-8 h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-slate-700"
          >
            <component
              :is="template.icon"
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
            />
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-300">{{
            template.label
          }}</span>
        </button>
      </div>
    </div>

    <!-- 自定义模板 -->
    <div v-if="customTemplates.length" class="mt-6">
      <h3
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
      >
        我的模板
      </h3>

      <div class="space-y-2">
        <div
          v-for="template in customTemplates"
          :key="template.id"
          class="w-full p-3 bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-lg flex items-center justify-between group"
        >
          <button
            class="flex items-center gap-3 flex-1 text-left"
            @click="loadCustomTemplate(template.id)"
          >
            <div
              class="w-8 h-8 flex items-center justify-center rounded bg-purple-100 dark:bg-slate-700"
            >
              <svg
                class="w-4 h-4 text-purple-500 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <span class="text-sm text-gray-700 dark:text-gray-300">{{
              template.name
            }}</span>
          </button>
          <button
            class="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            title="删除模板"
            @click.stop="deleteTemplate(template.id)"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import { editorStore } from "@/store/editor";

const searchQuery = ref("");

// 图标组件
const IconBox = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
        }),
      ]
    ),
};

const IconButton = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
        }),
      ]
    ),
};

const IconCard = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
        }),
      ]
    ),
};

const IconInput = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M11 5H6a2 2 0 00-2 2v3.5M13 5h5a2 2 0 012 2v3.5M11 19H6a2 2 0 01-2-2v-3.5M13 19h5a2 2 0 002-2v-3.5M3 12h18",
        }),
      ]
    ),
};

const IconBadge = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z",
        }),
      ]
    ),
};

const IconImage = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
        }),
      ]
    ),
};

const IconText = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6h16M4 12h16M4 18h7",
        }),
      ]
    ),
};

const IconHeading = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6h4M4 12h4m-4 6h4m4-12h4M8 6v12m8-12v12",
        }),
      ]
    ),
};

const IconFlex = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6h2M4 12h2M4 18h2M10 6h2M10 12h2M10 18h2M16 6h2M16 12h2M16 18h2",
        }),
      ]
    ),
};

const IconGrid = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
        }),
      ]
    ),
};

const IconStack = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6h16M4 12h16M4 18h16",
        }),
      ]
    ),
};

const IconCenter = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M12 4v16m-8-8h16",
        }),
      ]
    ),
};

const IconSpace = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        }),
      ]
    ),
};

const IconContainer = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
        }),
      ]
    ),
};

const IconTemplate = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
        }),
      ]
    ),
};

const IconLink = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
        }),
      ]
    ),
};

const IconTextarea = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6h16M4 10h16M4 14h16M4 18h10",
        }),
      ]
    ),
};

const IconSelect = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M8 9l4-4 4 4m0 6l-4 4-4-4",
        }),
      ]
    ),
};

const IconCheckbox = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        }),
      ]
    ),
};

const IconProgress = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 12h16",
        }),
      ]
    ),
};

const IconAlert = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        }),
      ]
    ),
};

const IconList = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 6h16M4 12h16M4 18h16",
        }),
      ]
    ),
};

const IconQuote = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
        }),
      ]
    ),
};

const IconCode = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
        }),
      ]
    ),
};

const IconStar = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.815l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.574-.38-1.815.588-1.815h4.914a1 1 0 00.951-.69l1.519-4.674z",
        }),
      ]
    ),
};

const IconChip = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z",
        }),
      ]
    ),
};

const IconSpinner = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
        }),
      ]
    ),
};

const IconSeparator = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M12 4v16",
        }),
      ]
    ),
};

const IconAvatar = {
  render: () =>
    h(
      "svg",
      {
        class: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        }),
      ]
    ),
};

const components = [
  { type: "div", label: "容器", icon: IconBox },
  { type: "button", label: "按钮", icon: IconButton },
  { type: "card", label: "卡片", icon: IconCard },
  { type: "input", label: "输入框", icon: IconInput },
  { type: "textarea", label: "文本域", icon: IconTextarea },
  { type: "select", label: "选择框", icon: IconSelect },
  { type: "checkbox", label: "复选框", icon: IconCheckbox },
  { type: "badge", label: "标签", icon: IconBadge },
  { type: "image", label: "图片", icon: IconImage },
  { type: "avatar", label: "头像", icon: IconAvatar },
  { type: "text", label: "文本", icon: IconText },
  { type: "heading", label: "标题", icon: IconHeading },
  { type: "link", label: "链接", icon: IconLink },
  { type: "quote", label: "引用", icon: IconQuote },
  { type: "code", label: "代码", icon: IconCode },
  { type: "divider", label: "分割线", icon: IconBox },
  { type: "alert", label: "提示框", icon: IconAlert },
  { type: "listitem", label: "列表项", icon: IconList },
  { type: "icon", label: "图标", icon: IconStar },
  { type: "chip", label: "Chip", icon: IconChip },
  { type: "progress", label: "进度条", icon: IconProgress },
  { type: "spinner", label: "加载", icon: IconSpinner },
  { type: "separator", label: "分隔符", icon: IconSeparator },
];

const layouts = [
  { type: "flex", label: "Flex 行", icon: IconFlex },
  { type: "grid", label: "Grid", icon: IconGrid },
  { type: "flex", label: "Stack", icon: IconStack },
  { type: "div", label: "Center", icon: IconCenter },
  { type: "spacer", label: "Space", icon: IconSpace },
  { type: "div", label: "Container", icon: IconContainer },
];

const templates = [
  { id: "basic-card", label: "基础卡片", icon: IconTemplate },
  { id: "button-group", label: "按钮组", icon: IconTemplate },
  { id: "navbar", label: "导航栏", icon: IconTemplate },
];

const filteredComponents = computed(() => {
  if (!searchQuery.value) return components;
  return components.filter(
    (c) =>
      c.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function addComponent(type: string) {
  editorStore.addNode(type);
}

function addTemplate(id: string) {
  editorStore.addTemplate(id);
}

// 新组件拖拽相关
function onComponentDragStart(e: DragEvent, type: string) {
  editorStore.setDragNewComponent(type);
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/x-new-component", type);
  }
}

function onComponentDragEnd() {
  editorStore.setDragNewComponent(null);
}

// 自定义模板
const customTemplates = computed(() => editorStore.customTemplates);

function loadCustomTemplate(id: string) {
  editorStore.loadCustomTemplate(id);
}

function deleteTemplate(id: string) {
  if (confirm("确定要删除此模板吗？")) {
    editorStore.deleteCustomTemplate(id);
    editorStore.customTemplates = editorStore.getCustomTemplates();
  }
}
</script>
