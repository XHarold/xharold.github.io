<script setup lang="ts">
import { useHead } from "@unhead/vue";
useHead({
  title: "404 · 页面不存在",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>
<template>
  <section class="shell not-found">
    <p class="eyebrow">404 / PAGE NOT FOUND</p>
    <h1>这个页面不存在。</h1>
    <p>链接可能已更改。你可以从首页重新查找项目和个人信息。</p>
    <RouterLink to="/" class="button-primary">回到首页 ↗</RouterLink>
  </section>
</template>
