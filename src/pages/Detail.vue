<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@unhead/vue";
import type { ContentEntry } from "../lib/content";
import { projects } from "../lib/content";
import { assetUrl } from "../lib/urls";
import ProjectArt from "../components/ProjectArt.vue";
const props = defineProps<{ entry: ContentEntry; kind: "work" | "note" }>();
const nextProject = computed(
  () =>
    projects[
      (projects.findIndex((p) => p.slug === props.entry.slug) + 1) %
        projects.length
    ],
);
useHead({
  title: () => props.entry.title,
  meta: computed(() => [
    { name: "description", content: props.entry.summary },
    {
      property: "og:title",
      content: `${props.entry.title} — Fan Ju`,
    },
    { property: "og:description", content: props.entry.summary },
  ]),
});
</script>
<template>
  <article class="shell detail-page">
    <header class="detail-heading">
      <RouterLink
        :to="kind === 'work' ? '/work/' : '/#notes-title'"
        class="back-link"
        >← {{ kind === "work" ? "全部项目" : "返回思考笔记" }}</RouterLink
      >
      <p class="eyebrow section-index">
        {{ kind === "work" ? "SELECTED WORK" : "THOUGHTS & NOTES" }} /
        {{ entry.category }}
      </p>
      <h1>{{ entry.title }}</h1>
      <p class="detail-subtitle">{{ entry.subtitle || entry.summary }}</p>
      <div v-if="entry.placeholder" class="content-notice">
        <span aria-hidden="true">◌</span>
        案例框架预览：文案与封面为方向示意，项目状态与成果待补充。
      </div>
      <dl v-if="kind === 'work'" class="project-meta">
        <div>
          <dt>DOMAIN / 项目领域</dt>
          <dd>{{ entry.domain }}</dd>
        </div>
        <div>
          <dt>STATUS / 当前状态</dt>
          <dd>{{ entry.status || "待确认" }}</dd>
        </div>
      </dl>
      <div v-if="entry.links?.length || entry.paperStatus" class="detail-links detail-heading-links">
        <a
          v-for="link in entry.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="button-primary"
          >{{ link.label }} ↗</a
        >
        <span v-if="entry.paperStatus" class="paper-status">{{ entry.paperStatus }}</span>
      </div>
      <a v-if="entry.demo" :href="assetUrl(entry.demo)" class="button-primary detail-demo-cta"
        >进入交互可视化 ↗</a
      >
      <p v-if="kind === 'note'" class="eyebrow">
        {{ entry.date }} / {{ entry.tags.join(" · ") }}
      </p>
    </header>
    <div v-if="kind === 'work'" class="detail-art">
      <img
        v-if="entry.cover"
        :src="assetUrl(entry.cover)"
        :alt="`${entry.title} 项目封面`"
        class="project-cover"
      /><ProjectArt v-else :kind="entry.art" />
    </div>
    <div class="detail-body">
      <aside v-if="kind === 'work'">
        <span class="eyebrow">THE STORY</span>
        <p>从为什么，<br />到如何实现。</p>
        <div class="detail-tags">
          <span v-for="tag in entry.tags" :key="tag">{{ tag }}</span>
        </div>
      </aside>
      <div class="prose" v-html="entry.html"></div>
    </div>
    <div v-if="entry.demo || entry.links?.length" class="detail-links">
      <a v-if="entry.demo" :href="assetUrl(entry.demo)" class="button-primary"
        >体验完整作品 ↗</a
      >
      <a
        v-for="link in entry.links"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="button-primary"
        >{{ link.label }} ↗</a
      >
    </div>
    <div v-if="kind === 'work' && nextProject" class="next-project">
      <span class="eyebrow">NEXT PROJECT</span
      ><RouterLink :to="`/work/${nextProject.slug}/`"
        >{{ nextProject.title }} <span>↗</span></RouterLink
      >
    </div>
  </article>
</template>
