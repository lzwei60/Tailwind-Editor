<template>
  <div class="p-4">
    <h2 class="panel-title">
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
      导出
    </h2>
    <div class="space-y-3">
      <textarea
        :value="htmlCode"
        readonly
        class="code-block w-full h-40 resize-none text-xs"
        placeholder="生成的 HTML 代码将显示在这里"
      />
      <div class="flex gap-2">
        <button class="btn btn-sm flex-1" @click="copyHtml">
          <svg
            class="w-3.5 h-3.5"
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
          复制代码
        </button>
        <button class="btn btn-sm btn-success" @click="downloadHtml">
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          下载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { editorStore } from "@/store/editor";
import type { EditorNode } from "@/store/editor";

const htmlCode = computed(() => {
  // 自闭合标签
  const selfClosingTags = ["img", "input", "hr", "br"];

  function renderNode(node: EditorNode): string {
    const tag = node.tag;
    const classAttr = node.class ? ` class="${node.class}"` : "";
    const children = node.children.map(renderNode).join("");

    // 自闭合标签
    if (selfClosingTags.includes(tag)) {
      if (tag === "input") {
        return `<input${classAttr} type="text" placeholder="输入内容" />`;
      }
      if (tag === "img") {
        return `<img${classAttr} src="https://placehold.co/200x150" alt="图片" />`;
      }
      return `<${tag}${classAttr} />`;
    }

    // 有文本内容的标签
    const content = node.text || children;
    return `<${tag}${classAttr}>${content}</${tag}>`;
  }

  return editorStore.nodes.map(renderNode).join("\n");
});

function copyHtml() {
  navigator.clipboard.writeText(htmlCode.value);
}

function downloadHtml() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Export</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body class="p-8">
${htmlCode.value}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tailwind-export.html";
  a.click();
  URL.revokeObjectURL(url);
}
</script>
