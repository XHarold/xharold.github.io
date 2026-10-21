<script setup lang="ts">
import { profile } from "../data/profile";
</script>

<template>
  <div class="contact-links">
    <a v-if="profile.email" :href="`mailto:${profile.email}`"
      >邮箱 <span aria-hidden="true">↗</span></a
    >
    <span v-if="!profile.email" class="contact-pending">邮箱待补充</span>
  </div>
</template>
