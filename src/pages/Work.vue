<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { projects } from "../lib/content";
import ProjectCard from "../components/ProjectCard.vue";
useHead({
  title: "项目",
  meta: [
    {
      name: "description",
      content: "项目案例：问题、设计取舍、实现过程与结果。",
    },
    { property: "og:title", content: "项目作品 — Fan Ju" },
  ],
});
</script>
<template>
  <div class="shell">
    <header class="page-heading">
      <p class="eyebrow section-index">项目</p>
      <h1>项目作品</h1>
      <p>点击项目了解背景与实现过程。Wiring the City 可直接进入交互演示。</p>
      <div class="page-heading-meta">
        <span class="eyebrow">COURTGRAPH · WIRING THE CITY · IELTS AGENT</span
        ><span class="pending-small">部分项目案例内容待补充</span>
      </div>
    </header>
    <div class="work-grid work-list">
      <ProjectCard
        v-for="(project, i) in projects"
        :key="project.slug"
        :project="project"
        :featured="i === 0"
      />
    </div>
    <div class="work-outro">
      <span>另外还有一个可以直接体验的交互练习。</span
      ><RouterLink to="/lab/" class="text-link">查看 Lab ↗</RouterLink>
    </div>
  </div>
</template>
