import { reactive, computed, ref, watch } from "vue";

export interface EditorNode {
  id: string;
  tag: string;
  class: string;
  text?: string;
  // 特殊组件选项
  inputType?: "text" | "checkbox" | "radio"; // input 类型区分
  options?: string[]; // 用于 select 下拉选项
  checked?: boolean; // 用于 checkbox
  styles: {
    // 布局
    display: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    gap: string;
    // 尺寸
    width: string;
    height: string;
    minWidth: string;
    minHeight: string;
    maxWidth: string;
    maxHeight: string;
    // 间距
    padding: string;
    margin: string;
    marginX: string;
    // 背景
    bgColor: string;
    bgGradient: string;
    opacity: string;
    // 文字
    textColor: string;
    fontSize: string;
    fontWeight: string;
    textAlign: string;
    lineHeight: string;
    letterSpacing: string;
    textDecoration: string;
    // 边框
    borderWidth: string;
    borderColor: string;
    borderStyle: string;
    borderRadius: string;
    // 效果
    shadow: string;
    overflow: string;
    cursor: string;
    transition: string;
    transform: string;
  };
  children: EditorNode[];
}

export type DropPosition = "before" | "after" | "inside";
export type ThemeMode = "light" | "dark" | "system";

// 默认样式
const defaultStyles: EditorNode["styles"] = {
  display: "",
  flexDirection: "",
  justifyContent: "",
  alignItems: "",
  gap: "",
  width: "",
  height: "",
  minWidth: "",
  minHeight: "",
  maxWidth: "",
  maxHeight: "",
  padding: "",
  margin: "",
  marginX: "",
  bgColor: "",
  bgGradient: "",
  opacity: "",
  textColor: "",
  fontSize: "",
  fontWeight: "",
  textAlign: "",
  lineHeight: "",
  letterSpacing: "",
  textDecoration: "",
  borderWidth: "",
  borderColor: "",
  borderStyle: "",
  borderRadius: "",
  shadow: "",
  overflow: "",
  cursor: "",
  transition: "",
  transform: "",
};

// 组件模板配置
export const componentTemplates: Record<string, Partial<EditorNode>> = {
  div: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      padding: "p-4",
      bgColor: "bg-gray-100",
      borderRadius: "rounded-lg",
      borderWidth: "border",
      borderColor: "border-gray-300",
      shadow: "shadow-sm",
    },
  },
  button: {
    tag: "button",
    text: "按钮",
    styles: {
      ...defaultStyles,
      padding: "px-4 py-2",
      bgColor: "bg-purple-500",
      textColor: "text-white",
      borderRadius: "rounded-md",
      cursor: "cursor-pointer",
      transition: "transition-all",
    },
  },
  text: {
    tag: "p",
    text: "这是一段文本",
    styles: {
      ...defaultStyles,
      margin: "mb-2",
      textColor: "text-gray-700",
      fontSize: "text-base",
    },
  },
  heading: {
    tag: "h2",
    text: "标题文本",
    styles: {
      ...defaultStyles,
      margin: "mb-4",
      textColor: "text-gray-900",
      fontSize: "text-2xl",
      fontWeight: "font-bold",
    },
  },
  image: {
    tag: "img",
    text: "",
    styles: {
      ...defaultStyles,
      width: "w-full",
      height: "h-48",
      bgColor: "bg-gray-200",
      borderRadius: "rounded-lg",
    },
  },
  card: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      padding: "p-6",
      bgColor: "bg-white",
      borderRadius: "rounded-xl",
      borderWidth: "border",
      borderColor: "border-gray-200",
      shadow: "shadow-lg",
    },
  },
  input: {
    tag: "input",
    inputType: "text",
    text: "",
    styles: {
      ...defaultStyles,
      width: "w-full",
      padding: "px-3 py-2",
      bgColor: "bg-white",
      borderRadius: "rounded-md",
      borderWidth: "border",
      borderColor: "border-gray-300",
    },
  },
  badge: {
    tag: "span",
    text: "标签",
    styles: {
      ...defaultStyles,
      display: "inline-flex",
      padding: "px-2 py-1",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-700",
      fontSize: "text-xs",
      borderRadius: "rounded-full",
    },
  },
  divider: {
    tag: "hr",
    text: "",
    styles: {
      ...defaultStyles,
      margin: "my-4",
      borderWidth: "border-t",
      borderColor: "border-gray-300",
    },
  },
  avatar: {
    tag: "div",
    text: "👤",
    styles: {
      ...defaultStyles,
      display: "flex",
      justifyContent: "justify-center",
      alignItems: "items-center",
      width: "w-12",
      height: "h-12",
      bgColor: "bg-gray-300",
      fontSize: "text-2xl",
      borderRadius: "rounded-full",
    },
  },
  flex: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      display: "flex",
      flexDirection: "flex-row",
      gap: "gap-4",
      padding: "p-4",
      bgColor: "bg-gray-50",
      borderRadius: "rounded-lg",
    },
  },
  grid: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      display: "grid grid-cols-2",
      gap: "gap-4",
      padding: "p-4",
      bgColor: "bg-gray-50",
      borderRadius: "rounded-lg",
    },
  },
  spacer: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      width: "flex-1",
    },
  },
  // 新增组件
  link: {
    tag: "a",
    text: "链接文本",
    styles: {
      ...defaultStyles,
      textColor: "text-purple-600",
      textDecoration: "underline",
      cursor: "cursor-pointer",
    },
  },
  textarea: {
    tag: "textarea",
    text: "",
    styles: {
      ...defaultStyles,
      width: "w-full",
      height: "h-24",
      padding: "px-3 py-2",
      bgColor: "bg-white",
      borderRadius: "rounded-md",
      borderWidth: "border",
      borderColor: "border-gray-300",
    },
  },
  select: {
    tag: "select",
    text: "",
    options: ["选项一", "选项二", "选项三"],
    styles: {
      ...defaultStyles,
      width: "w-full",
      padding: "px-3 py-2",
      bgColor: "bg-white",
      borderRadius: "rounded-md",
      borderWidth: "border",
      borderColor: "border-gray-300",
    },
  },
  checkbox: {
    tag: "label",
    inputType: "checkbox",
    text: "复选框标签",
    checked: false,
    styles: {
      ...defaultStyles,
      display: "inline-flex",
      alignItems: "items-center",
      gap: "gap-2",
      cursor: "cursor-pointer",
    },
  },
  progress: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      width: "w-full",
      height: "h-2",
      bgColor: "bg-gray-200",
      borderRadius: "rounded-full",
    },
  },
  alert: {
    tag: "div",
    text: "这是一条提示信息",
    styles: {
      ...defaultStyles,
      padding: "px-4 py-3",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderRadius: "rounded-lg",
      borderWidth: "border",
      borderColor: "border-blue-200",
    },
  },
  listitem: {
    tag: "li",
    text: "列表项",
    styles: {
      ...defaultStyles,
      padding: "py-2",
      textColor: "text-gray-700",
      borderWidth: "border-b",
      borderColor: "border-gray-100",
    },
  },
  quote: {
    tag: "blockquote",
    text: "这是一段引用文本",
    styles: {
      ...defaultStyles,
      padding: "pl-4",
      textColor: "text-gray-600",
      borderWidth: "border-l-4",
      borderColor: "border-purple-500",
      bgColor: "bg-gray-50",
    },
  },
  code: {
    tag: "code",
    text: "code",
    styles: {
      ...defaultStyles,
      padding: "px-1.5 py-0.5",
      bgColor: "bg-gray-100",
      textColor: "text-red-600",
      fontSize: "text-sm",
      borderRadius: "rounded",
    },
  },
  icon: {
    tag: "div",
    text: "★",
    styles: {
      ...defaultStyles,
      display: "flex",
      justifyContent: "justify-center",
      alignItems: "items-center",
      width: "w-8",
      height: "h-8",
      textColor: "text-purple-500",
      fontSize: "text-xl",
    },
  },
  chip: {
    tag: "span",
    text: "Chip",
    styles: {
      ...defaultStyles,
      display: "inline-flex",
      justifyContent: "justify-center",
      alignItems: "items-center",
      padding: "px-3 py-1",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      fontSize: "text-sm",
      borderRadius: "rounded-full",
    },
  },
  spinner: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      width: "w-6",
      height: "h-6",
      borderWidth: "border-2",
      borderColor: "border-purple-500",
      borderRadius: "rounded-full",
    },
  },
  separator: {
    tag: "div",
    text: "",
    styles: {
      ...defaultStyles,
      width: "w-px",
      height: "h-6",
      bgColor: "bg-gray-300",
    },
  },
};

// 模板配置 - 预定义的组件组合
export const templateConfigs: Record<string, () => EditorNode[]> = {
  // 基础卡片模板
  "basic-card": () => {
    const id = Date.now().toString();
    return [
      {
        id,
        tag: "div",
        class: "",
        text: "",
        styles: {
          ...defaultStyles,
          padding: "p-6",
          bgColor: "bg-white",
          borderRadius: "rounded-xl",
          shadow: "shadow-lg",
          borderWidth: "border",
          borderColor: "border-gray-200",
        },
        children: [
          {
            id: `${id}-1`,
            tag: "h3",
            class: "",
            text: "卡片标题",
            styles: {
              ...defaultStyles,
              fontSize: "text-lg",
              fontWeight: "font-semibold",
              textColor: "text-gray-900",
              margin: "mb-2",
            },
            children: [],
          },
          {
            id: `${id}-2`,
            tag: "p",
            class: "",
            text: "这是一段卡片描述文字，可以在这里添加更多内容。",
            styles: {
              ...defaultStyles,
              textColor: "text-gray-600",
              fontSize: "text-sm",
              margin: "mb-4",
            },
            children: [],
          },
          {
            id: `${id}-3`,
            tag: "button",
            class: "",
            text: "了解更多",
            styles: {
              ...defaultStyles,
              padding: "px-4 py-2",
              bgColor: "bg-purple-600",
              textColor: "text-white",
              borderRadius: "rounded-lg",
              fontSize: "text-sm",
              cursor: "cursor-pointer",
              transition: "transition-colors",
            },
            children: [],
          },
        ],
      },
    ];
  },

  // 按钮组模板
  "button-group": () => {
    const id = Date.now().toString();
    return [
      {
        id,
        tag: "div",
        class: "",
        text: "",
        styles: {
          ...defaultStyles,
          display: "flex",
          gap: "gap-3",
        },
        children: [
          {
            id: `${id}-1`,
            tag: "button",
            class: "",
            text: "主要按钮",
            styles: {
              ...defaultStyles,
              padding: "px-4 py-2",
              bgColor: "bg-purple-600",
              textColor: "text-white",
              borderRadius: "rounded-lg",
              fontSize: "text-sm",
              cursor: "cursor-pointer",
              transition: "transition-colors",
            },
            children: [],
          },
          {
            id: `${id}-2`,
            tag: "button",
            class: "",
            text: "次要按钮",
            styles: {
              ...defaultStyles,
              padding: "px-4 py-2",
              bgColor: "bg-gray-200",
              textColor: "text-gray-700",
              borderRadius: "rounded-lg",
              fontSize: "text-sm",
              cursor: "cursor-pointer",
              transition: "transition-colors",
            },
            children: [],
          },
          {
            id: `${id}-3`,
            tag: "button",
            class: "",
            text: "边框按钮",
            styles: {
              ...defaultStyles,
              padding: "px-4 py-2",
              bgColor: "bg-transparent",
              textColor: "text-purple-600",
              borderRadius: "rounded-lg",
              borderWidth: "border-2",
              borderColor: "border-purple-600",
              fontSize: "text-sm",
              cursor: "cursor-pointer",
              transition: "transition-colors",
            },
            children: [],
          },
        ],
      },
    ];
  },

  // 导航栏模板
  navbar: () => {
    const id = Date.now().toString();
    return [
      {
        id,
        tag: "nav",
        class: "",
        text: "",
        styles: {
          ...defaultStyles,
          display: "flex",
          justifyContent: "justify-between",
          alignItems: "items-center",
          padding: "px-6 py-4",
          bgColor: "bg-white",
          shadow: "shadow-sm",
          borderWidth: "border-b",
          borderColor: "border-gray-200",
        },
        children: [
          {
            id: `${id}-1`,
            tag: "div",
            class: "",
            text: "",
            styles: {
              ...defaultStyles,
              display: "flex",
              alignItems: "items-center",
              gap: "gap-2",
            },
            children: [
              {
                id: `${id}-1-1`,
                tag: "div",
                class: "",
                text: "",
                styles: {
                  ...defaultStyles,
                  width: "w-8",
                  height: "h-8",
                  bgColor: "bg-purple-600",
                  borderRadius: "rounded-lg",
                },
                children: [],
              },
              {
                id: `${id}-1-2`,
                tag: "span",
                class: "",
                text: "Logo",
                styles: {
                  ...defaultStyles,
                  fontSize: "text-lg",
                  fontWeight: "font-bold",
                  textColor: "text-gray-900",
                },
                children: [],
              },
            ],
          },
          {
            id: `${id}-2`,
            tag: "div",
            class: "",
            text: "",
            styles: {
              ...defaultStyles,
              display: "flex",
              gap: "gap-6",
            },
            children: [
              {
                id: `${id}-2-1`,
                tag: "a",
                class: "",
                text: "首页",
                styles: {
                  ...defaultStyles,
                  textColor: "text-gray-600",
                  fontSize: "text-sm",
                  cursor: "cursor-pointer",
                },
                children: [],
              },
              {
                id: `${id}-2-2`,
                tag: "a",
                class: "",
                text: "产品",
                styles: {
                  ...defaultStyles,
                  textColor: "text-gray-600",
                  fontSize: "text-sm",
                  cursor: "cursor-pointer",
                },
                children: [],
              },
              {
                id: `${id}-2-3`,
                tag: "a",
                class: "",
                text: "关于",
                styles: {
                  ...defaultStyles,
                  textColor: "text-gray-600",
                  fontSize: "text-sm",
                  cursor: "cursor-pointer",
                },
                children: [],
              },
            ],
          },
          {
            id: `${id}-3`,
            tag: "button",
            class: "",
            text: "开始使用",
            styles: {
              ...defaultStyles,
              padding: "px-4 py-2",
              bgColor: "bg-purple-600",
              textColor: "text-white",
              borderRadius: "rounded-lg",
              fontSize: "text-sm",
              cursor: "cursor-pointer",
            },
            children: [],
          },
        ],
      },
    ];
  },
};

interface HistoryState {
  nodes: EditorNode[];
  selectedId: string | null;
}

// 历史记录状态
const history = ref<HistoryState[]>([]);
const historyIndex = ref(-1);
const maxHistory = 50;

// 编辑器状态
const nodes = ref<EditorNode[]>([]);
const selectedId = ref<string | null>(null);
const dragNodeId = ref<string | null>(null);
// 全局拖拽指示状态
const dragOverNodeId = ref<string | null>(null);
const dragDropPosition = ref<DropPosition | "inside" | null>(null);
// 新组件拖拽状态（从组件面板拖拽）
const dragNewComponentType = ref<string | null>(null);

// 主题状态
const themeMode = ref<ThemeMode>(
  (localStorage.getItem("editor-theme") as ThemeMode) || "system"
);

// 计算实际主题
const actualTheme = computed(() => {
  if (themeMode.value === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return themeMode.value;
});

// 应用主题到 DOM
function applyTheme() {
  // 直接计算当前主题，避免依赖 computed 的更新时机
  let theme: "light" | "dark";
  if (themeMode.value === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } else {
    theme = themeMode.value;
  }
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

// 监听系统主题变化
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", () => {
  if (themeMode.value === "system") {
    applyTheme();
  }
});

// 监听主题模式变化
watch(
  themeMode,
  () => {
    localStorage.setItem("editor-theme", themeMode.value);
    applyTheme();
  },
  { immediate: true }
);

// 设置主题
function setTheme(mode: ThemeMode) {
  themeMode.value = mode;
}

// 计算属性
const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);

/**
 * 深拷贝节点数组
 */
function cloneNodes(nodesArr: EditorNode[]): EditorNode[] {
  return JSON.parse(JSON.stringify(nodesArr));
}

/**
 * 保存当前状态到历史记录
 */
function pushHistory() {
  // 删除当前位置之后的所有历史
  history.value = history.value.slice(0, historyIndex.value + 1);

  // 添加新状态
  history.value.push({
    nodes: cloneNodes(nodes.value),
    selectedId: selectedId.value,
  });

  // 限制历史记录数量
  if (history.value.length > maxHistory) {
    history.value.shift();
  } else {
    historyIndex.value++;
  }
}

/**
 * 撤销
 */
function undo() {
  if (!canUndo.value) return;
  historyIndex.value--;
  const state = history.value[historyIndex.value];
  nodes.value = cloneNodes(state.nodes);
  selectedId.value = state.selectedId;
}

/**
 * 重做
 */
function redo() {
  if (!canRedo.value) return;
  historyIndex.value++;
  const state = history.value[historyIndex.value];
  nodes.value = cloneNodes(state.nodes);
  selectedId.value = state.selectedId;
}

/**
 * 初始化历史记录（首次加载）
 */
function initHistory() {
  if (history.value.length === 0) {
    pushHistory();
  }
}

function findNode(nodeList: EditorNode[], id: string): EditorNode | null {
  for (const node of nodeList) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * 查找节点的父节点和在父节点数组中的索引
 */
function findParentAndIndex(
  nodeList: EditorNode[],
  id: string,
  parent: EditorNode[] | null = null
): { parent: EditorNode[] | null; index: number; node: EditorNode | null } {
  for (let i = 0; i < nodeList.length; i++) {
    if (nodeList[i].id === id) {
      return { parent: parent || nodes.value, index: i, node: nodeList[i] };
    }
    const found = findParentAndIndex(
      nodeList[i].children,
      id,
      nodeList[i].children
    );
    if (found.node) return found;
  }
  return { parent: null, index: -1, node: null };
}

/**
 * 检查 targetId 是否是 dragId 的后代节点
 */
function isDescendant(dragId: string, targetId: string): boolean {
  const dragNode = findNode(nodes.value, dragId);
  if (!dragNode) return false;

  const checkChildren = (node: EditorNode): boolean => {
    for (const child of node.children) {
      if (child.id === targetId) return true;
      if (checkChildren(child)) return true;
    }
    return false;
  };

  return checkChildren(dragNode);
}

function addNode(tag: string, parentId?: string) {
  const template = componentTemplates[tag] || componentTemplates.div;

  // 合并默认样式和模板样式
  const mergedStyles: EditorNode["styles"] = {
    ...defaultStyles,
    ...(template.styles || {}),
  };

  const newNode: EditorNode = {
    id: Date.now().toString(),
    tag: template.tag || "div",
    text: template.text || "",
    class: "",
    inputType: template.inputType,
    options: template.options ? [...template.options] : undefined,
    checked: template.checked,
    styles: mergedStyles,
    children: [],
  };

  // 计算最终 class
  newNode.class = computeNodeClass(newNode);

  if (parentId) {
    const parent = findNode(nodes.value, parentId);
    if (parent) {
      parent.children.push(newNode);
    }
  } else {
    nodes.value.push(newNode);
  }

  pushHistory();
}

/**
 * 在指定位置添加新节点（从组件面板拖拽）
 */
function addNodeAt(
  tag: string,
  targetId: string | null,
  position: DropPosition | "inside"
) {
  const template = componentTemplates[tag] || componentTemplates.div;

  // 合并默认样式和模板样式
  const mergedStyles: EditorNode["styles"] = {
    ...defaultStyles,
    ...(template.styles || {}),
  };

  const newNode: EditorNode = {
    id: Date.now().toString(),
    tag: template.tag || "div",
    text: template.text || "",
    class: "",
    inputType: template.inputType,
    options: template.options ? [...template.options] : undefined,
    checked: template.checked,
    styles: mergedStyles,
    children: [],
  };

  // 计算最终 class
  newNode.class = computeNodeClass(newNode);

  if (!targetId) {
    // 没有目标节点，添加到根级别
    nodes.value.push(newNode);
  } else if (position === "inside") {
    // 放入目标节点内部
    const target = findNode(nodes.value, targetId);
    if (target) {
      target.children.push(newNode);
    }
  } else {
    // 放在目标节点之前或之后
    const { parent, index } = findParentAndIndex(nodes.value, targetId);
    if (parent && index !== -1) {
      const insertIndex = position === "before" ? index : index + 1;
      parent.splice(insertIndex, 0, newNode);
    }
  }

  pushHistory();
  return newNode;
}

/**
 * 设置新组件拖拽状态
 */
function setDragNewComponent(type: string | null) {
  dragNewComponentType.value = type;
}

/**
 * 添加模板
 */
function addTemplate(templateId: string) {
  const templateGenerator = templateConfigs[templateId];
  if (!templateGenerator) {
    console.warn(`Template "${templateId}" not found`);
    return;
  }

  const templateNodes = templateGenerator();

  // 为每个节点计算 class 并添加到画布
  function processNode(node: EditorNode): EditorNode {
    // 递归处理子节点
    const processedChildren = node.children.map(processNode);

    // 计算 class
    const nodeWithClass = {
      ...node,
      class: computeNodeClass(node),
      children: processedChildren,
    };

    return nodeWithClass;
  }

  // 处理并添加所有节点
  for (const node of templateNodes) {
    const processedNode = processNode(node);
    nodes.value.push(processedNode);
  }

  pushHistory();
}

/**
 * 计算节点的 class 字符串
 */
function computeNodeClass(node: EditorNode): string {
  const { styles } = node;
  const classes = [
    // 布局
    styles.display,
    styles.flexDirection,
    styles.justifyContent,
    styles.alignItems,
    styles.gap,
    // 尺寸
    styles.width,
    styles.height,
    styles.minWidth,
    styles.minHeight,
    styles.maxWidth,
    styles.maxHeight,
    // 间距
    styles.padding,
    styles.margin,
    styles.marginX,
    // 背景
    styles.bgColor,
    styles.bgGradient,
    styles.opacity,
    // 文字
    styles.textColor,
    styles.fontSize,
    styles.fontWeight,
    styles.textAlign,
    styles.lineHeight,
    styles.letterSpacing,
    styles.textDecoration,
    // 边框
    styles.borderWidth,
    styles.borderColor,
    styles.borderStyle,
    styles.borderRadius,
    // 效果
    styles.shadow,
    styles.overflow,
    styles.cursor,
    styles.transition,
    styles.transform,
  ].filter(Boolean);
  return classes.join(" ");
}

/**
 * 生成单个节点的 HTML
 */
function generateNodeHtml(node: EditorNode, indent: string = "  "): string {
  const selfClosingTags = ["img", "hr", "br", "meta", "link"];
  const isSelfClosing = selfClosingTags.includes(node.tag);

  const classAttr = node.class ? ` class="${node.class}"` : "";

  // 处理 select 下拉框
  if (node.tag === "select") {
    const optionsHtml = (node.options || [])
      .map((opt) => `${indent}  <option>${opt}</option>`)
      .join("\n");
    return `${indent}<${node.tag}${classAttr}>\n${optionsHtml}\n${indent}</${node.tag}>`;
  }

  // 处理 checkbox (label 包裹 input + span)
  if (node.inputType === "checkbox") {
    const checkedAttr = node.checked ? " checked" : "";
    const checkboxHtml = `${indent}<${
      node.tag
    }${classAttr}>\n${indent}  <input type="checkbox"${checkedAttr} class="w-4 h-4 rounded border-gray-300 text-purple-500" />\n${indent}  <span>${
      node.text || ""
    }</span>\n${indent}</${node.tag}>`;
    return checkboxHtml;
  }

  if (isSelfClosing) {
    return `${indent}<${node.tag}${classAttr} />`;
  }

  const textContent = node.text || "";
  const childrenHtml = node.children
    .map((child) => generateNodeHtml(child, indent + "  "))
    .join("\n");

  if (textContent && !node.children.length) {
    return `${indent}<${node.tag}${classAttr}>${textContent}</${node.tag}>`;
  }

  if (!textContent && !node.children.length) {
    return `${indent}<${node.tag}${classAttr}></${node.tag}>`;
  }

  const innerContent = textContent
    ? `\n${indent}  ${textContent}\n${indent}`
    : childrenHtml
    ? `\n${childrenHtml}\n${indent}`
    : "";

  return `${indent}<${node.tag}${classAttr}>${innerContent}</${node.tag}>`;
}

/**
 * 生成完整的 HTML 文档
 */
function generateHtml(): string {
  const nodesHtml = nodes.value
    .map((node) => generateNodeHtml(node))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <title>Tailwind 导出</title>
</head>
<body>
${nodesHtml}
</body>
</html>`;
}

/**
 * 生成所有节点的 class 字符串
 */
function generateAllClasses(): string {
  const classes: string[] = [];

  function collectClasses(nodeList: EditorNode[]) {
    for (const node of nodeList) {
      if (node.class) {
        classes.push(node.class);
      }
      if (node.children.length) {
        collectClasses(node.children);
      }
    }
  }

  collectClasses(nodes.value);
  return classes.join("\n");
}

/**
 * 移动节点到目标位置
 */
function moveNode(
  dragId: string,
  targetId: string,
  position: DropPosition
): boolean {
  if (dragId === targetId) return false;

  if (isDescendant(dragId, targetId)) return false;

  const {
    parent: sourceParent,
    index: sourceIndex,
    node: dragNode,
  } = findParentAndIndex(nodes.value, dragId);
  if (!dragNode || sourceIndex === -1) return false;

  if (sourceParent) {
    sourceParent.splice(sourceIndex, 1);
  }

  if (position === "inside") {
    const targetNode = findNode(nodes.value, targetId);
    if (!targetNode) {
      if (sourceParent) sourceParent.splice(sourceIndex, 0, dragNode);
      return false;
    }
    targetNode.children.push(dragNode);
  } else {
    const { parent: targetParent, index: targetIndex } = findParentAndIndex(
      nodes.value,
      targetId
    );
    const insertIndex = position === "before" ? targetIndex : targetIndex + 1;

    if (targetParent) {
      targetParent.splice(insertIndex, 0, dragNode);
    } else {
      nodes.value.splice(insertIndex, 0, dragNode);
    }
  }

  pushHistory();
  return true;
}

/**
 * 移动节点到根级别
 */
function moveNodeToRoot(dragId: string): boolean {
  const {
    parent: sourceParent,
    index: sourceIndex,
    node: dragNode,
  } = findParentAndIndex(nodes.value, dragId);

  if (!dragNode || sourceIndex === -1) return false;

  // 如果节点已经在根级别，不需要移动
  if (!sourceParent) return false;

  // 从原位置移除
  sourceParent.splice(sourceIndex, 1);

  // 添加到根级别末尾
  nodes.value.push(dragNode);

  pushHistory();
  return true;
}

function selectNode(id: string) {
  selectedId.value = id;
}

function updateClass(id: string) {
  const node = findNode(nodes.value, id);
  if (!node) return;

  node.class = computeNodeClass(node);
  pushHistory();
}

function setDragNode(id: string | null) {
  dragNodeId.value = id;
  // 清除拖拽指示状态
  if (id === null) {
    dragOverNodeId.value = null;
    dragDropPosition.value = null;
  }
}

// 设置拖拽经过状态（全局唯一）
function setDragOver(
  nodeId: string | null,
  position: DropPosition | "inside" | null
) {
  dragOverNodeId.value = nodeId;
  dragDropPosition.value = position;
}

function deleteNode(id: string) {
  const { parent, index } = findParentAndIndex(nodes.value, id);
  if (parent && index !== -1) {
    parent.splice(index, 1);
    if (selectedId.value === id) {
      selectedId.value = null;
    }
    pushHistory();
  }
}

/**
 * 复制节点
 */
function duplicateNode(id: string): boolean {
  const { parent, index, node } = findParentAndIndex(nodes.value, id);
  if (!node || index === -1) return false;

  // 深拷贝节点
  const clonedNode = cloneNodes([node])[0];

  // 重新生成 ID
  function regenerateId(n: EditorNode): EditorNode {
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...n,
      id: newId,
      children: n.children.map(regenerateId),
    };
  }

  const newNode = regenerateId(clonedNode);

  // 插入到原节点后面
  if (parent) {
    parent.splice(index + 1, 0, newNode);
  } else {
    nodes.value.splice(index + 1, 0, newNode);
  }

  // 选中新节点
  selectedId.value = newNode.id;
  pushHistory();
  return true;
}

// 自定义模板存储 key
const CUSTOM_TEMPLATES_KEY = "tailwind-editor-custom-templates";

// 自定义模板类型
export interface CustomTemplate {
  id: string;
  name: string;
  createdAt: number;
  nodes: EditorNode[];
}

// 获取自定义模板列表
function getCustomTemplates(): CustomTemplate[] {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 保存为自定义模板
function saveAsTemplate(name: string): boolean {
  if (!nodes.value.length) {
    return false;
  }

  const templates = getCustomTemplates();
  const newTemplate: CustomTemplate = {
    id: `custom-${Date.now()}`,
    name,
    createdAt: Date.now(),
    nodes: cloneNodes(nodes.value),
  };

  templates.push(newTemplate);
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  return true;
}

// 删除自定义模板
function deleteCustomTemplate(id: string): boolean {
  const templates = getCustomTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index !== -1) {
    templates.splice(index, 1);
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    return true;
  }
  return false;
}

// 加载自定义模板
function loadCustomTemplate(id: string): boolean {
  const templates = getCustomTemplates();
  const template = templates.find((t) => t.id === id);
  if (!template) {
    return false;
  }

  // 重新生成 ID 并计算 class
  function regenerateNode(node: EditorNode): EditorNode {
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...node,
      id: newId,
      class: computeNodeClass(node),
      children: node.children.map(regenerateNode),
    };
  }

  for (const node of template.nodes) {
    nodes.value.push(regenerateNode(node));
  }

  pushHistory();
  return true;
}

// 导出统一的 store 对象
export const editorStore = reactive({
  // 状态
  nodes,
  selectedId,
  dragNodeId,
  dragOverNodeId,
  dragDropPosition,
  dragNewComponentType,
  history,
  historyIndex,
  themeMode,
  actualTheme,
  customTemplates: getCustomTemplates(),

  // 计算属性
  canUndo,
  canRedo,

  // 方法
  initHistory,
  pushHistory,
  undo,
  redo,
  addNode,
  addNodeAt,
  addTemplate,
  findNode,
  findParentAndIndex,
  moveNode,
  moveNodeToRoot,
  isDescendant,
  selectNode,
  updateClass,
  setDragNode,
  setDragOver,
  setDragNewComponent,
  deleteNode,
  duplicateNode,
  cloneNodes,
  setTheme,
  applyTheme,
  computeNodeClass,
  generateHtml,
  generateAllClasses,
  // 自定义模板相关
  getCustomTemplates,
  saveAsTemplate,
  deleteCustomTemplate,
  loadCustomTemplate,
});
