<script setup lang="ts">
import type { ContentEntry } from "../lib/content";
import { assetUrl } from "../lib/urls";
import ProjectArt from "./ProjectArt.vue";
defineProps<{ project: ContentEntry; featured?: boolean }>();
</script>

<template>
  <article class="project-card" :class="{ 'project-featured': featured }">
    <RouterLink
      :to="`/work/${project.slug}/`"
      class="project-image-link"
      :aria-label="`查看 ${project.title} 项目案例`"
    >
      <img
        v-if="project.cover"
        :src="assetUrl(project.cover)"
        :alt="`${project.title} 项目封面`"
        class="project-cover"
        loading="lazy"
      />
      <ProjectArt v-else :kind="project.art" />
      <span class="project-open" aria-hidden="true">↗</span>
    </RouterLink>
    <div class="project-caption">
      <div>
        <p class="eyebrow">{{ project.category }}</p>
        <h3>
          <RouterLink :to="`/work/${project.slug}/`"
            >{{ project.title }} <span aria-hidden="true">↗</span></RouterLink
          >
        </h3>
        <p class="project-subtitle">{{ project.subtitle }}</p>
      </div>
      <span class="project-number">0{{ project.order }}</span>
    </div>
    <div class="project-tags">
      <span v-for="tag in project.tags" :key="tag">{{ tag }}</span
      ><span v-if="project.placeholder" class="draft-tag">案例待补充</span>
    </div>
  </article>
</template>
