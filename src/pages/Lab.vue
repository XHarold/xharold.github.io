<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { experiments } from "../data/lab";
import NodeNetwork from "../components/NodeNetwork.vue";
const experimentComponents = { NodeNetwork };
useHead({
  title: "实验室",
  meta: [
    {
      name: "description",
      content: "一个可以拖动节点的 Canvas 交互练习，支持鼠标、触摸和键盘。",
    },
    { property: "og:title", content: "交互实验 — Fan Ju" },
  ],
});
</script>
<template>
  <div class="shell lab-page">
    <header class="page-heading">
      <p class="eyebrow section-index">实验室</p>
      <h1>交互实验</h1>
      <p>这里收录可以直接体验的小作品。先从一个节点网络开始。</p>
    </header>
    <section
      id="connected-thoughts"
      class="lab-experiment"
      aria-labelledby="experiment-title"
    >
      <div class="experiment-heading">
        <div>
          <p class="eyebrow">EXPERIMENT 001 / CANVAS</p>
          <h2 id="experiment-title">{{ experiments[0].title }}</h2>
        </div>
        <span class="live-label"><i class="status-dot"></i> 可交互</span>
      </div>
      <p class="experiment-intro">
        {{ experiments[0].description }}
        鼠标或手指拖动节点，也可以通过下方控件选择并移动。
      </p>
      <component
        :is="experimentComponents[experiments[0].component]"
        mode="lab"
      />
      <div class="experiment-footnote">
        <span>所有操作均在浏览器中完成。</span
        ><span class="eyebrow">MOUSE · TOUCH · KEYBOARD</span>
      </div>
    </section>
  </div>
</template>
