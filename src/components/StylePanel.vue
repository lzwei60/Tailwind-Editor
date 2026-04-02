<template>
  <div class="p-4 overflow-y-auto max-h-full">
    <div v-if="selectedNode" class="space-y-6">
      <!-- 组件操作 -->
      <div class="flex gap-2">
        <button
          class="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
          @click="duplicateSelectedNode"
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
        <button
          class="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-1.5"
          @click="deleteSelectedNode"
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
          删除
        </button>
      </div>

      <!-- 文本内容 -->
      <div v-if="showTextField">
        <label
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block"
          >文本内容</label
        >
        <input
          v-model="selectedNode.text"
          type="text"
          class="w-full px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-purple-500"
          placeholder="输入文本..."
          @input="updateNodeClass"
        />
      </div>

      <!-- 复选框配置 -->
      <div v-if="selectedNode.inputType === 'checkbox'">
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          复选框配置
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >标签文本</span
            >
            <input
              v-model="selectedNode.text"
              type="text"
              class="flex-1 ml-3 px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
              placeholder="标签"
              @input="updateNodeClass"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >默认选中</span
            >
            <button
              class="w-10 h-6 rounded-full transition-colors"
              :class="
                selectedNode.checked
                  ? 'bg-purple-500'
                  : 'bg-gray-300 dark:bg-slate-600'
              "
              @click="toggleCheckbox"
            >
              <div
                class="w-4 h-4 rounded-full bg-white shadow transform transition-transform"
                :class="
                  selectedNode.checked ? 'translate-x-5' : 'translate-x-1'
                "
              />
            </button>
          </div>
        </div>
      </div>

      <!-- 下拉选择配置 -->
      <div v-if="selectedNode.tag === 'select'">
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          下拉选项
        </h3>
        <div class="space-y-2">
          <div
            v-for="(option, index) in selectOptions"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              :value="option"
              type="text"
              class="flex-1 px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
              @input="(e) => updateOption(index, (e.target as HTMLInputElement).value)"
            />
            <button
              class="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              @click="removeOption(index)"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <button
            class="w-full py-2 text-sm text-purple-600 dark:text-purple-400 border border-dashed border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            @click="addOption"
          >
            + 添加选项
          </button>
        </div>
      </div>

      <!-- 列表项配置 -->
      <div v-if="selectedNode.tag === 'li'">
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          列表项内容
        </h3>
        <input
          v-model="selectedNode.text"
          type="text"
          class="w-full px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-purple-500"
          placeholder="列表项文本..."
          @input="updateNodeClass"
        />
      </div>

      <!-- 布局 -->
      <div>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          布局
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >display</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.display"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="block">block</option>
                <option value="flex">flex</option>
                <option value="inline-flex">inline-flex</option>
                <option value="grid">grid</option>
                <option value="inline">inline</option>
                <option value="inline-block">inline-block</option>
                <option value="hidden">hidden</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >flex-direction</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.flexDirection"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="flex-row">row</option>
                <option value="flex-row-reverse">row-reverse</option>
                <option value="flex-col">col</option>
                <option value="flex-col-reverse">col-reverse</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >justify</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.justifyContent"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="justify-start">start</option>
                <option value="justify-center">center</option>
                <option value="justify-end">end</option>
                <option value="justify-between">between</option>
                <option value="justify-around">around</option>
                <option value="justify-evenly">evenly</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >align-items</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.alignItems"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="items-start">start</option>
                <option value="items-center">center</option>
                <option value="items-end">end</option>
                <option value="items-baseline">baseline</option>
                <option value="items-stretch">stretch</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">gap</span>
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.gap"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="gap-0">0</option>
                <option value="gap-1">1</option>
                <option value="gap-2">2</option>
                <option value="gap-3">3</option>
                <option value="gap-4">4</option>
                <option value="gap-5">5</option>
                <option value="gap-6">6</option>
                <option value="gap-8">8</option>
                <option value="gap-10">10</option>
                <option value="gap-12">12</option>
                <option value="gap-16">16</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 尺寸 -->
      <div>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          尺寸
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">width</span>
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.width"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">自动</option>
                <option value="w-auto">auto</option>
                <option value="w-full">full</option>
                <option value="w-screen">screen</option>
                <option value="w-fit">fit</option>
                <option value="w-min">min</option>
                <option value="w-max">max</option>
                <option value="flex-1">flex-1</option>
                <option value="w-16">16</option>
                <option value="w-20">20</option>
                <option value="w-24">24</option>
                <option value="w-32">32</option>
                <option value="w-40">40</option>
                <option value="w-48">48</option>
                <option value="w-56">56</option>
                <option value="w-64">64</option>
                <option value="w-72">72</option>
                <option value="w-80">80</option>
                <option value="w-96">96</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">height</span>
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.height"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">自动</option>
                <option value="h-auto">auto</option>
                <option value="h-full">full</option>
                <option value="h-screen">screen</option>
                <option value="h-fit">fit</option>
                <option value="h-min">min</option>
                <option value="h-max">max</option>
                <option value="h-8">8</option>
                <option value="h-10">10</option>
                <option value="h-12">12</option>
                <option value="h-16">16</option>
                <option value="h-20">20</option>
                <option value="h-24">24</option>
                <option value="h-32">32</option>
                <option value="h-40">40</option>
                <option value="h-48">48</option>
                <option value="h-56">56</option>
                <option value="h-64">64</option>
                <option value="h-72">72</option>
                <option value="h-80">80</option>
                <option value="h-96">96</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >max-width</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.maxWidth"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="max-w-none">none</option>
                <option value="max-w-xs">xs</option>
                <option value="max-w-sm">sm</option>
                <option value="max-w-md">md</option>
                <option value="max-w-lg">lg</option>
                <option value="max-w-xl">xl</option>
                <option value="max-w-2xl">2xl</option>
                <option value="max-w-3xl">3xl</option>
                <option value="max-w-4xl">4xl</option>
                <option value="max-w-5xl">5xl</option>
                <option value="max-w-6xl">6xl</option>
                <option value="max-w-7xl">7xl</option>
                <option value="max-w-full">full</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >min-height</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.minHeight"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="min-h-0">0</option>
                <option value="min-h-full">full</option>
                <option value="min-h-screen">screen</option>
                <option value="min-h-8">8</option>
                <option value="min-h-12">12</option>
                <option value="min-h-16">16</option>
                <option value="min-h-20">20</option>
                <option value="min-h-24">24</option>
                <option value="min-h-32">32</option>
                <option value="min-h-48">48</option>
                <option value="min-h-64">64</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 间距 -->
      <div>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          间距
        </h3>
        <div class="space-y-3">
          <StyleRow
            label="padding"
            :value="selectedNode.styles.padding"
            :tag="selectedNode.styles.padding"
            @update="(v: string) => updateStyle('padding', v)"
          />
          <StyleRow
            label="margin-top"
            :value="selectedNode.styles.margin"
            :tag="selectedNode.styles.margin"
            @update="(v: string) => updateStyle('margin', v)"
          />
          <StyleRow
            label="margin-x"
            :value="selectedNode.styles.marginX"
            :tag="selectedNode.styles.marginX"
            @update="(v: string) => updateStyle('marginX', v)"
          />
        </div>
      </div>

      <!-- 文字 -->
      <div>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          文字
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >font-size</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.fontSize"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="text-xs">xs</option>
                <option value="text-sm">sm</option>
                <option value="text-base">base</option>
                <option value="text-lg">lg</option>
                <option value="text-xl">xl</option>
                <option value="text-2xl">2xl</option>
                <option value="text-3xl">3xl</option>
                <option value="text-4xl">4xl</option>
                <option value="text-5xl">5xl</option>
                <option value="text-6xl">6xl</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >font-weight</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.fontWeight"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="font-thin">thin</option>
                <option value="font-light">light</option>
                <option value="font-normal">normal</option>
                <option value="font-medium">medium</option>
                <option value="font-semibold">semibold</option>
                <option value="font-bold">bold</option>
                <option value="font-extrabold">extrabold</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >line-height</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.lineHeight"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="leading-none">none</option>
                <option value="leading-tight">tight</option>
                <option value="leading-snug">snug</option>
                <option value="leading-normal">normal</option>
                <option value="leading-relaxed">relaxed</option>
                <option value="leading-loose">loose</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >text-decoration</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.textDecoration"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="underline">underline</option>
                <option value="overline">overline</option>
                <option value="line-through">line-through</option>
                <option value="no-underline">no-underline</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >text-align</span
            >
            <div class="flex items-center gap-1">
              <button
                class="p-1.5 rounded transition-colors"
                :class="
                  selectedNode.styles.textAlign === ''
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                "
                @click="updateStyle('textAlign', '')"
              >
                <span class="text-xs">无</span>
              </button>
              <button
                v-for="align in textAlignOptions"
                :key="align.value"
                class="p-1.5 rounded transition-colors"
                :class="
                  selectedNode.styles.textAlign === align.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                "
                @click="updateStyle('textAlign', align.value)"
              >
                <component :is="align.icon" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 颜色 -->
      <div>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          颜色
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">背景色</span>
            <div class="flex items-center gap-2">
              <button
                class="w-6 h-6 rounded border border-gray-300 dark:border-slate-700 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                :class="{
                  'ring-2 ring-purple-500': !selectedNode.styles.bgColor,
                }"
                @click="updateStyle('bgColor', '')"
                title="无背景"
              >
                ✕
              </button>
              <input
                type="color"
                :value="getColorValue(selectedNode.styles.bgColor)"
                class="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-slate-700"
                @input="(e) => updateColor('bgColor', (e.target as HTMLInputElement).value)"
              />
              <select
                :value="selectedNode.styles.bgColor"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-xs text-gray-700 dark:text-gray-300 focus:outline-none max-w-[120px]"
                @change="(e) => updateStyle('bgColor', (e.target as HTMLSelectElement).value)"
              >
                <option value="">无</option>
                <option value="bg-transparent">transparent</option>
                <option value="bg-white">white</option>
                <option value="bg-black">black</option>
                <optgroup label="Gray">
                  <option value="bg-gray-50">gray-50</option>
                  <option value="bg-gray-100">gray-100</option>
                  <option value="bg-gray-200">gray-200</option>
                  <option value="bg-gray-300">gray-300</option>
                  <option value="bg-gray-400">gray-400</option>
                  <option value="bg-gray-500">gray-500</option>
                  <option value="bg-gray-600">gray-600</option>
                  <option value="bg-gray-700">gray-700</option>
                  <option value="bg-gray-800">gray-800</option>
                  <option value="bg-gray-900">gray-900</option>
                </optgroup>
                <optgroup label="Red">
                  <option value="bg-red-50">red-50</option>
                  <option value="bg-red-100">red-100</option>
                  <option value="bg-red-500">red-500</option>
                  <option value="bg-red-600">red-600</option>
                </optgroup>
                <optgroup label="Orange">
                  <option value="bg-orange-100">orange-100</option>
                  <option value="bg-orange-500">orange-500</option>
                </optgroup>
                <optgroup label="Yellow">
                  <option value="bg-yellow-100">yellow-100</option>
                  <option value="bg-yellow-500">yellow-500</option>
                </optgroup>
                <optgroup label="Green">
                  <option value="bg-green-50">green-50</option>
                  <option value="bg-green-100">green-100</option>
                  <option value="bg-green-500">green-500</option>
                  <option value="bg-green-600">green-600</option>
                </optgroup>
                <optgroup label="Blue">
                  <option value="bg-blue-50">blue-50</option>
                  <option value="bg-blue-100">blue-100</option>
                  <option value="bg-blue-500">blue-500</option>
                  <option value="bg-blue-600">blue-600</option>
                </optgroup>
                <optgroup label="Indigo">
                  <option value="bg-indigo-100">indigo-100</option>
                  <option value="bg-indigo-500">indigo-500</option>
                  <option value="bg-indigo-600">indigo-600</option>
                </optgroup>
                <optgroup label="Purple">
                  <option value="bg-purple-50">purple-50</option>
                  <option value="bg-purple-100">purple-100</option>
                  <option value="bg-purple-500">purple-500</option>
                  <option value="bg-purple-600">purple-600</option>
                </optgroup>
                <optgroup label="Pink">
                  <option value="bg-pink-100">pink-100</option>
                  <option value="bg-pink-500">pink-500</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">文字色</span>
            <div class="flex items-center gap-2">
              <button
                class="w-6 h-6 rounded border border-gray-300 dark:border-slate-700 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                :class="{
                  'ring-2 ring-purple-500': !selectedNode.styles.textColor,
                }"
                @click="updateStyle('textColor', '')"
                title="无颜色"
              >
                ✕
              </button>
              <input
                type="color"
                :value="getColorValue(selectedNode.styles.textColor)"
                class="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-slate-700"
                @input="(e) => updateColor('textColor', (e.target as HTMLInputElement).value)"
              />
              <select
                :value="selectedNode.styles.textColor"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-xs text-gray-700 dark:text-gray-300 focus:outline-none max-w-[120px]"
                @change="(e) => updateStyle('textColor', (e.target as HTMLSelectElement).value)"
              >
                <option value="">无</option>
                <option value="text-transparent">transparent</option>
                <option value="text-white">white</option>
                <option value="text-black">black</option>
                <optgroup label="Gray">
                  <option value="text-gray-400">gray-400</option>
                  <option value="text-gray-500">gray-500</option>
                  <option value="text-gray-600">gray-600</option>
                  <option value="text-gray-700">gray-700</option>
                  <option value="text-gray-800">gray-800</option>
                  <option value="text-gray-900">gray-900</option>
                </optgroup>
                <optgroup label="Red">
                  <option value="text-red-500">red-500</option>
                  <option value="text-red-600">red-600</option>
                </optgroup>
                <optgroup label="Green">
                  <option value="text-green-500">green-500</option>
                  <option value="text-green-600">green-600</option>
                </optgroup>
                <optgroup label="Blue">
                  <option value="text-blue-500">blue-500</option>
                  <option value="text-blue-600">blue-600</option>
                </optgroup>
                <optgroup label="Indigo">
                  <option value="text-indigo-500">indigo-500</option>
                  <option value="text-indigo-600">indigo-600</option>
                </optgroup>
                <optgroup label="Purple">
                  <option value="text-purple-500">purple-500</option>
                  <option value="text-purple-600">purple-600</option>
                </optgroup>
                <optgroup label="Pink">
                  <option value="text-pink-500">pink-500</option>
                  <option value="text-pink-600">pink-600</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">边框色</span>
            <div class="flex items-center gap-2">
              <button
                class="w-6 h-6 rounded border border-gray-300 dark:border-slate-700 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                :class="{
                  'ring-2 ring-purple-500': !selectedNode.styles.borderColor,
                }"
                @click="updateStyle('borderColor', '')"
                title="无边框色"
              >
                ✕
              </button>
              <input
                type="color"
                :value="getColorValue(selectedNode.styles.borderColor)"
                class="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-slate-700"
                @input="(e) => updateColor('borderColor', (e.target as HTMLInputElement).value)"
              />
              <select
                :value="selectedNode.styles.borderColor"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-xs text-gray-700 dark:text-gray-300 focus:outline-none max-w-[120px]"
                @change="(e) => updateStyle('borderColor', (e.target as HTMLSelectElement).value)"
              >
                <option value="">无</option>
                <option value="border-transparent">transparent</option>
                <option value="border-white">white</option>
                <option value="border-black">black</option>
                <optgroup label="Gray">
                  <option value="border-gray-100">gray-100</option>
                  <option value="border-gray-200">gray-200</option>
                  <option value="border-gray-300">gray-300</option>
                  <option value="border-gray-400">gray-400</option>
                  <option value="border-gray-500">gray-500</option>
                </optgroup>
                <optgroup label="Red">
                  <option value="border-red-500">red-500</option>
                </optgroup>
                <optgroup label="Green">
                  <option value="border-green-500">green-500</option>
                </optgroup>
                <optgroup label="Blue">
                  <option value="border-blue-500">blue-500</option>
                </optgroup>
                <optgroup label="Purple">
                  <option value="border-purple-500">purple-500</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 边框 -->
      <div>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          边框
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >border-width</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.borderWidth"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="border">all</option>
                <option value="border-0">0</option>
                <option value="border-2">2</option>
                <option value="border-4">4</option>
                <option value="border-8">8</option>
                <option value="border-t">top</option>
                <option value="border-r">right</option>
                <option value="border-b">bottom</option>
                <option value="border-l">left</option>
                <option value="border-x">x</option>
                <option value="border-y">y</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >border-style</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.borderStyle"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="border-solid">solid</option>
                <option value="border-dashed">dashed</option>
                <option value="border-dotted">dotted</option>
                <option value="border-double">double</option>
                <option value="border-none">none</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">圆角</span>
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.borderRadius"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="rounded-none">none</option>
                <option value="rounded-sm">sm</option>
                <option value="rounded">默认</option>
                <option value="rounded-md">md</option>
                <option value="rounded-lg">lg</option>
                <option value="rounded-xl">xl</option>
                <option value="rounded-2xl">2xl</option>
                <option value="rounded-3xl">3xl</option>
                <option value="rounded-full">full</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 效果 -->
      <div>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
        >
          效果
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">阴影</span>
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.shadow"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="shadow-none">none</option>
                <option value="shadow-sm">sm</option>
                <option value="shadow">默认</option>
                <option value="shadow-md">md</option>
                <option value="shadow-lg">lg</option>
                <option value="shadow-xl">xl</option>
                <option value="shadow-2xl">2xl</option>
                <option value="shadow-inner">inner</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >opacity</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.opacity"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="opacity-0">0</option>
                <option value="opacity-5">5%</option>
                <option value="opacity-10">10%</option>
                <option value="opacity-20">20%</option>
                <option value="opacity-25">25%</option>
                <option value="opacity-30">30%</option>
                <option value="opacity-40">40%</option>
                <option value="opacity-50">50%</option>
                <option value="opacity-60">60%</option>
                <option value="opacity-70">70%</option>
                <option value="opacity-75">75%</option>
                <option value="opacity-80">80%</option>
                <option value="opacity-90">90%</option>
                <option value="opacity-100">100%</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >overflow</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.overflow"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="overflow-auto">auto</option>
                <option value="overflow-hidden">hidden</option>
                <option value="overflow-visible">visible</option>
                <option value="overflow-scroll">scroll</option>
                <option value="overflow-x-auto">x-auto</option>
                <option value="overflow-y-auto">y-auto</option>
                <option value="overflow-x-hidden">x-hidden</option>
                <option value="overflow-y-hidden">y-hidden</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">cursor</span>
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.cursor"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">默认</option>
                <option value="cursor-auto">auto</option>
                <option value="cursor-default">default</option>
                <option value="cursor-pointer">pointer</option>
                <option value="cursor-wait">wait</option>
                <option value="cursor-text">text</option>
                <option value="cursor-move">move</option>
                <option value="cursor-not-allowed">not-allowed</option>
                <option value="cursor-crosshair">crosshair</option>
                <option value="cursor-grab">grab</option>
                <option value="cursor-grabbing">grabbing</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >transition</span
            >
            <div class="flex items-center gap-2">
              <select
                v-model="selectedNode.styles.transition"
                class="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                @change="updateNodeClass"
              >
                <option value="">无</option>
                <option value="transition-none">none</option>
                <option value="transition-all">all</option>
                <option value="transition">default</option>
                <option value="transition-colors">colors</option>
                <option value="transition-opacity">opacity</option>
                <option value="transition-shadow">shadow</option>
                <option value="transition-transform">transform</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-sm text-gray-400 dark:text-gray-500 py-12 text-center border border-dashed border-gray-300 dark:border-slate-700 rounded-lg"
    >
      <svg
        class="w-10 h-10 mx-auto mb-2 opacity-40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
      选择一个组件进行编辑
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { editorStore } from "@/store/editor";

// 样式行组件
const StyleRow = {
  props: ["label", "value", "tag"],
  emits: ["update"],
  setup(
    props: { label: string; value: string; tag: string },
    { emit }: { emit: (e: string, v: string) => void }
  ) {
    const spacingValues = [
      0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20,
      24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
    ];

    const formatSpacing = (num: number): string => {
      return String(num);
    };

    const getDefaultPrefix = (label: string): string => {
      const labelToPrefix: Record<string, string> = {
        padding: "p",
        "margin-top": "mt",
        "margin-x": "mx",
        "margin-y": "my",
      };
      return labelToPrefix[label] || "p";
    };

    const incrementValue = (currentValue: string, delta: number): string => {
      const match = currentValue.match(
        /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-([\d.]+)$/
      );

      if (!match) {
        if (delta > 0) {
          return `${getDefaultPrefix(props.label)}-4`;
        }
        return "";
      }

      const prefix = match[1];
      const currentNum = parseFloat(match[2]);
      const currentIndex = spacingValues.findIndex((v) => v === currentNum);

      if (currentIndex === -1) {
        const closestIndex = spacingValues.findIndex((v) => v > currentNum);
        if (delta > 0) {
          const newIndex =
            closestIndex >= 0 ? closestIndex : spacingValues.length - 1;
          return `${prefix}-${formatSpacing(spacingValues[newIndex])}`;
        }
        const newIndex = closestIndex > 0 ? closestIndex - 1 : 0;
        return spacingValues[newIndex] === 0
          ? ""
          : `${prefix}-${formatSpacing(spacingValues[newIndex])}`;
      }

      const newIndex = Math.max(
        0,
        Math.min(spacingValues.length - 1, currentIndex + (delta > 0 ? 1 : -1))
      );
      const newNum = spacingValues[newIndex];

      return newNum === 0 ? "" : `${prefix}-${formatSpacing(newNum)}`;
    };

    return () =>
      h("div", { class: "flex items-center justify-between" }, [
        h(
          "span",
          { class: "text-sm text-gray-500 dark:text-gray-400" },
          props.label
        ),
        h(
          "div",
          { class: "flex items-center gap-2" },
          [
            h(
              "button",
              {
                class:
                  "w-6 h-6 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700",
                onClick: () => emit("update", incrementValue(props.value, -4)),
              },
              "-"
            ),
            h("input", {
              type: "text",
              value: props.value,
              class:
                "w-16 px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-600 dark:text-gray-300 text-center",
              onInput: (e: Event) =>
                emit("update", (e.target as HTMLInputElement).value),
            }),
            h(
              "button",
              {
                class:
                  "w-6 h-6 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700",
                onClick: () => emit("update", incrementValue(props.value, 4)),
              },
              "+"
            ),
            props.tag
              ? h(
                  "span",
                  {
                    class:
                      "px-2 py-0.5 bg-purple-600 text-white text-xs rounded",
                  },
                  props.tag
                )
              : null,
          ].filter(Boolean)
        ),
      ]);
  },
};

// 对齐图标
const IconAlignLeft = {
  render: () =>
    h(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4 6h16M4 12h10M4 18h14",
        }),
      ]
    ),
};

const IconAlignCenter = {
  render: () =>
    h(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4 6h16M7 12h10M5 18h14",
        }),
      ]
    ),
};

const IconAlignRight = {
  render: () =>
    h(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M4 6h16M10 12h10M6 18h14",
        }),
      ]
    ),
};

const textAlignOptions = [
  { value: "text-left", icon: IconAlignLeft },
  { value: "text-center", icon: IconAlignCenter },
  { value: "text-right", icon: IconAlignRight },
];

const selectedNode = computed(() => {
  if (!editorStore.selectedId) return null;
  return editorStore.findNode(editorStore.nodes, editorStore.selectedId);
});

const showTextField = computed(() => {
  const tags = [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "button",
    "a",
    "label",
    "li",
    "blockquote",
    "code",
  ];
  return selectedNode.value && tags.includes(selectedNode.value.tag);
});

// 下拉选项
const selectOptions = computed(() => {
  if (selectedNode.value && selectedNode.value.options) {
    return selectedNode.value.options;
  }
  return [];
});

function addOption() {
  if (selectedNode.value) {
    if (!selectedNode.value.options) {
      selectedNode.value.options = [];
    }
    selectedNode.value.options.push("新选项");
  }
}

function removeOption(index: number) {
  if (selectedNode.value && selectedNode.value.options) {
    selectedNode.value.options.splice(index, 1);
  }
}

function updateOption(index: number, value: string) {
  if (selectedNode.value && selectedNode.value.options) {
    selectedNode.value.options[index] = value;
  }
}

function toggleCheckbox() {
  if (selectedNode.value) {
    selectedNode.value.checked = !selectedNode.value.checked;
  }
}

function updateStyle(key: string, value: string) {
  if (selectedNode.value) {
    (selectedNode.value.styles as Record<string, string>)[key] = value;
    updateNodeClass();
  }
}

function updateNodeClass() {
  if (editorStore.selectedId) {
    editorStore.updateClass(editorStore.selectedId);
  }
}

function duplicateSelectedNode() {
  if (editorStore.selectedId) {
    editorStore.duplicateNode(editorStore.selectedId);
  }
}

function deleteSelectedNode() {
  if (editorStore.selectedId) {
    editorStore.deleteNode(editorStore.selectedId);
  }
}

function getColorValue(tailwindClass: string): string {
  const colorMap: Record<string, string> = {
    "bg-white": "#ffffff",
    "bg-black": "#000000",
    "bg-gray-50": "#f9fafb",
    "bg-gray-100": "#f3f4f6",
    "bg-gray-200": "#e5e7eb",
    "bg-gray-300": "#d1d5db",
    "bg-gray-400": "#9ca3af",
    "bg-gray-500": "#6b7280",
    "bg-gray-600": "#4b5563",
    "bg-gray-700": "#374151",
    "bg-gray-800": "#1f2937",
    "bg-gray-900": "#111827",
    "bg-purple-500": "#a855f7",
    "bg-purple-600": "#9333ea",
    "bg-red-500": "#ef4444",
    "bg-green-500": "#22c55e",
    "bg-blue-500": "#3b82f6",
    "text-white": "#ffffff",
    "text-black": "#000000",
    "text-gray-400": "#9ca3af",
    "text-gray-500": "#6b7280",
    "text-gray-600": "#4b5563",
    "text-gray-700": "#374151",
    "text-gray-800": "#1f2937",
    "text-gray-900": "#111827",
    "text-purple-500": "#a855f7",
    "text-purple-600": "#9333ea",
    "border-gray-200": "#e5e7eb",
    "border-gray-300": "#d1d5db",
    "border-gray-400": "#9ca3af",
    "border-gray-500": "#6b7280",
  };
  return colorMap[tailwindClass] || "#6b7280";
}

function updateColor(key: string, hexValue: string) {
  const hexToTailwind: Record<string, Record<string, string>> = {
    "#ffffff": {
      bgColor: "bg-white",
      textColor: "text-white",
      borderColor: "border-white",
    },
    "#000000": {
      bgColor: "bg-black",
      textColor: "text-black",
      borderColor: "border-black",
    },
    "#f9fafb": { bgColor: "bg-gray-50" },
    "#f3f4f6": { bgColor: "bg-gray-100" },
    "#e5e7eb": { bgColor: "bg-gray-200", borderColor: "border-gray-200" },
    "#d1d5db": { bgColor: "bg-gray-300", borderColor: "border-gray-300" },
    "#6b7280": {
      bgColor: "bg-gray-500",
      textColor: "text-gray-500",
      borderColor: "border-gray-500",
    },
    "#374151": { bgColor: "bg-gray-700", textColor: "text-gray-700" },
    "#1f2937": { bgColor: "bg-gray-800", textColor: "text-gray-800" },
    "#111827": { bgColor: "bg-gray-900", textColor: "text-gray-900" },
    "#a855f7": {
      bgColor: "bg-purple-500",
      textColor: "text-purple-500",
      borderColor: "border-purple-500",
    },
    "#9333ea": {
      bgColor: "bg-purple-600",
      textColor: "text-purple-600",
      borderColor: "border-purple-600",
    },
    "#ef4444": {
      bgColor: "bg-red-500",
      textColor: "text-red-500",
      borderColor: "border-red-500",
    },
    "#22c55e": {
      bgColor: "bg-green-500",
      textColor: "text-green-500",
      borderColor: "border-green-500",
    },
    "#3b82f6": {
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
    },
  };

  const colorMap = hexToTailwind[hexValue.toLowerCase()];
  if (colorMap && colorMap[key]) {
    updateStyle(key, colorMap[key]);
  }
}
</script>
