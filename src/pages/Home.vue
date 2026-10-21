<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { projects, notes } from "../lib/content";
import { profile } from "../data/profile";
import { assetUrl } from "../lib/urls";
import ProjectCard from "../components/ProjectCard.vue";
import ContactLinks from "../components/ContactLinks.vue";

const selectedProjects = projects.filter((project) => project.featured).slice(0, 2);

useHead({
  title: "个人网站",
  meta: [
    { property: "og:title", content: `${profile.name}｜个人网站` },
    { property: "og:description", content: profile.tagline },
  ],
});
</script>

<template>
  <div class="home-page personal-home">
    <section id="about" class="intro-hero shell" aria-labelledby="hero-title">
      <div class="intro-copy">
        <p class="eyebrow intro-label">About / 个人经历</p>
        <h1 id="hero-title">{{ profile.name }}</h1>
        <p class="intro-english-name">{{ profile.englishName }}</p>
        <div class="profile-history">
          <section class="resume-overview-column" aria-labelledby="education-title">
            <h2 id="education-title">教育背景 <small>Educational Background</small></h2>
            <div v-if="profile.education.length" class="resume-entry-list">
              <article v-for="item in profile.education" :key="item.period + item.school">
                <span>{{ item.period }}</span>
                <div>
                  <h3>{{ item.school }}</h3>
                  <p>{{ item.program }}</p>
                </div>
              </article>
            </div>
            <p v-else class="resume-empty">学校、专业与就读时间待补充。</p>
          </section>
          <section id="internship" class="resume-overview-column" aria-labelledby="internship-title">
            <h2 id="internship-title">实习经历 <small>Internship</small></h2>
            <div v-if="profile.experiences.length" class="resume-entry-list">
              <article
                v-for="item in profile.experiences"
                :key="item.period + item.title"
              >
                <span>{{ item.period }}</span>
                <div>
                  <h3>{{ item.title }}</h3>
                  <p class="resume-entry-organization">{{ item.organization }}</p>
                  <p>{{ item.description }}</p>
                </div>
              </article>
            </div>
            <p v-else class="resume-empty">实习经历待补充。</p>
          </section>
        </div>
      </div>
      <figure class="intro-portrait">
        <img
          v-if="profile.portrait"
          :src="assetUrl(profile.portrait)"
          :alt="`${profile.name} 的个人照片`"
        />
        <div v-else class="intro-portrait-placeholder" role="img" aria-label="个人照片待补充">
          <span>个人照片</span>
          <p>待补充真实照片</p>
        </div>
      </figure>
    </section>

    <section id="selected-work" class="section shell selected-work" aria-labelledby="work-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow section-index">项目</p>
          <h2 id="work-title">代表项目</h2>
        </div>
        <RouterLink to="/work/" class="text-link"
          >查看全部项目 <span aria-hidden="true">↗</span></RouterLink
        >
      </div>
      <p class="section-intro">这里先展示两个项目。点击卡片可查看背景、我的工作和实现过程。</p>
      <div class="work-grid home-work-grid">
        <ProjectCard
          v-for="project in selectedProjects"
          :key="project.slug"
          :project="project"
        />
      </div>
    </section>

    <section class="more-section shell" aria-labelledby="more-title">
      <div>
        <p class="eyebrow section-index">更多内容</p>
        <h2 id="more-title">项目之外</h2>
        <p>在实验室可以体验一个可拖动的节点交互练习。</p>
      </div>
      <RouterLink to="/lab/" class="text-link"
        >查看交互实验 <span aria-hidden="true">↗</span></RouterLink
      >
    </section>

    <section v-if="notes.length" class="section shell notes-section" aria-labelledby="notes-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow section-index">笔记</p>
          <h2 id="notes-title">最近记录</h2>
        </div>
      </div>
      <div class="notes-list">
        <RouterLink
          v-for="note in notes.slice(0, 3)"
          :key="note.slug"
          :to="`/notes/${note.slug}/`"
          class="note-row"
        >
          <span>{{ note.title }}</span><span class="eyebrow">{{ note.category }} / {{ note.date }}</span>
          <span aria-hidden="true">↗</span>
        </RouterLink>
      </div>
    </section>

    <section id="contact" class="contact-section shell" aria-labelledby="contact-title">
      <div>
        <p class="eyebrow section-index">联系</p>
        <h2 id="contact-title">联系我</h2>
        <p>欢迎通过邮箱联系。</p>
      </div>
      <ContactLinks />
    </section>
  </div>
</template>
