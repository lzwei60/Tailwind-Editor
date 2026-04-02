# Tailwind 可视化编辑器

一个基于 Vue 3 + TypeScript 的 Tailwind CSS 可视化编辑器，支持拖拽式组件搭建、实时样式编辑和 HTML 导出。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全
- **Vite** - 下一代前端构建工具
- **Tailwind CSS 3** - 实用优先的 CSS 框架
- **Pinia (reactive)** - 状态管理

## 功能特性

### 核心功能

- **拖拽搭建** - 从组件面板拖拽组件到画布，支持位置调整
- **实时预览** - 所见即所得的编辑体验
- **样式编辑** - 可视化配置布局、尺寸、颜色、边框等样式
- **嵌套支持** - 组件可嵌套，支持容器类组件
- **撤销/重做** - 完整的历史记录功能

### 导出功能

- **复制 HTML** - 生成完整的 HTML 文档
- **复制 Class** - 仅复制 Tailwind 类名
- **保存模板** - 将当前设计保存为可复用模板

### 主题支持

- 支持亮色/暗色/跟随系统三种主题模式

## 项目结构

```
tailwind-editor/
├── src/
│   ├── components/          # 组件目录
│   │   ├── Canvas.vue       # 画布组件
│   │   ├── ComponentPanel.vue # 组件面板
│   │   ├── StylePanel.vue   # 样式面板
│   │   ├── NodeRenderer.vue # 节点渲染器
│   │   └── ...
│   ├── layout/
│   │   └── home.vue         # 主布局
│   ├── store/
│   │   └── editor.ts        # 编辑器状态管理
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 组件列表

| 组件      | 标签         | 说明             |
| --------- | ------------ | ---------------- |
| 容器      | `div`        | 基础容器组件     |
| 按钮      | `button`     | 可点击按钮       |
| 文本      | `p`          | 段落文本         |
| 标题      | `h2`         | 标题文本         |
| 图片      | `img`        | 图片占位         |
| 卡片      | `div`        | 带阴影的卡片容器 |
| 输入框    | `input`      | 文本输入框       |
| 标签      | `span`       | 徽章标签         |
| 分割线    | `hr`         | 水平分割线       |
| 头像      | `div`        | 圆形头像占位     |
| Flex 容器 | `div`        | 弹性布局容器     |
| Grid 容器 | `div`        | 网格布局容器     |
| 弹性空间  | `div`        | 占位空间         |
| 链接      | `a`          | 超链接           |
| 文本域    | `textarea`   | 多行文本输入     |
| 下拉框    | `select`     | 下拉选择框       |
| 复选框    | `label`      | 复选框组件       |
| 进度条    | `div`        | 进度指示器       |
| 提示框    | `div`        | 警告/提示信息    |
| 列表项    | `li`         | 列表项           |
| 引用      | `blockquote` | 引用文本         |

## 样式配置

编辑器支持以下样式属性的可视化配置：

### 布局

- `display` - 显示类型 (flex, grid, block 等)
- `flexDirection` - 弹性方向
- `justifyContent` - 主轴对齐
- `alignItems` - 交叉轴对齐
- `gap` - 间距

### 尺寸

- `width` / `height` - 宽高
- `minWidth` / `minHeight` - 最小尺寸
- `maxWidth` / `maxHeight` - 最大尺寸

### 间距

- `padding` - 内边距
- `margin` - 外边距
- `marginX` - 水平外边距

### 背景

- `bgColor` - 背景色
- `bgGradient` - 渐变背景
- `opacity` - 透明度

### 文字

- `textColor` - 文字颜色
- `fontSize` - 字体大小
- `fontWeight` - 字重
- `textAlign` - 对齐方式
- `lineHeight` - 行高
- `letterSpacing` - 字间距
- `textDecoration` - 文字装饰

### 边框

- `borderWidth` - 边框宽度
- `borderColor` - 边框颜色
- `borderStyle` - 边框样式
- `borderRadius` - 圆角

### 效果

- `shadow` - 阴影
- `overflow` - 溢出处理
- `cursor` - 鼠标样式
- `transition` - 过渡动画
- `transform` - 变换

## 特殊组件配置

### 下拉框 (select)

- 支持动态添加/删除选项
- 支持修改选项文本

### 复选框 (checkbox)

- 支持编辑标签文本
- 支持设置默认选中状态

### 列表项 (li)

- 支持编辑列表项内容

## 模板功能

编辑器支持将当前设计保存为自定义模板：

1. 点击顶部工具栏的「保存为模板」按钮
2. 输入模板名称
3. 模板将保存在本地存储中
4. 可从左侧模板面板快速加载

## 操作说明

### 组件操作

- **添加组件** - 从左侧面板拖拽到画布
- **选中组件** - 点击画布中的组件
- **复制组件** - 选中后点击右侧面板的「复制」按钮
- **删除组件** - 选中后点击右侧面板的「删除」按钮
- **移动组件** - 拖拽组件调整位置
- **嵌套组件** - 拖拽到容器组件内部

### 拖拽指示

- **上方绿线** - 将放置在目标组件之前
- **下方绿线** - 将放置在目标组件之后
- **绿色遮罩** - 将放入目标容器内部

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
