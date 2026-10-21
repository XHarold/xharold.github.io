<script setup lang="ts">
import { computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { profile } from "./data/profile";
import { siteUrl, assetUrl } from "./lib/urls";
import ContactLinks from "./components/ContactLinks.vue";

const route = useRoute();
const canonical = computed(() =>
  siteUrl
    ? `${siteUrl}${import.meta.env.BASE_URL.replace(/\/$/, "")}${route.path}`
    : undefined,
);
useHead({
  htmlAttrs: { lang: "zh-CN" },
  titleTemplate: (title) =>
    title ? `${title}｜${profile.name}` : `${profile.name}｜个人网站`,
  meta: [
    { name: "description", content: profile.tagline },
    {
      name: "robots",
      content: profile.isPlaceholder ? "noindex, nofollow" : "index, follow",
    },
    { property: "og:site_name", content: `${profile.name}｜个人网站` },
    { property: "og:locale", content: "zh_CN" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image",
      content: siteUrl
        ? `${siteUrl}${assetUrl("social-card.png")}`
        : assetUrl("social-card.png"),
    },
  ],
  link: computed(() =>
    canonical.value ? [{ rel: "canonical", href: canonical.value }] : [],
  ),
});

watch(
  () => route.path,
  async () => {
    await nextTick();
    document
      .querySelector<HTMLElement>("#main-content")
      ?.focus({ preventScroll: true });
  },
);
</script>

<template>
  <a class="skip-link" href="#main-content">跳转到正文</a>
  <header class="site-header">
    <div class="shell header-inner">
      <RouterLink to="/" class="brand" :aria-label="`${profile.englishName} 首页`"
        >{{ profile.wordmark }}</RouterLink
      >
      <nav aria-label="主导航">
        <RouterLink
          to="/#about"
          custom
          v-slot="{ href, navigate }"
          ><a
            :href="href"
            :class="{ active: route.path === '/' && route.hash === '#about' }"
            @click="navigate"
            ><span>About</span><small>个人经历</small></a
          ></RouterLink
        >
        <RouterLink
          to="/work/"
          :class="{ active: route.path.startsWith('/work') }"
          ><span>Project</span><small>项目</small></RouterLink
        >
        <RouterLink
          to="/#contact"
          custom
          v-slot="{ href, navigate }"
          ><a
            :href="href"
            :class="{ active: route.path === '/' && route.hash === '#contact' }"
            @click="navigate"
            ><span>Contact</span><small>联系</small></a
          ></RouterLink
        >
      </nav>
    </div>
  </header>
  <main id="main-content" tabindex="-1"><RouterView /></main>
  <footer class="site-footer shell">
    <div class="footer-top">
      <RouterLink to="/" class="brand"
        >{{ profile.wordmark }}</RouterLink
      ><ContactLinks />
    </div>
    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} {{ profile.englishName }}</span
      ><span
        >个人网站<span v-if="profile.isPlaceholder" class="preview-label"
          >资料校对中</span
        ></span
      ><a href="#main-content">返回顶部 ↑</a>
    </div>
  </footer>
</template>
