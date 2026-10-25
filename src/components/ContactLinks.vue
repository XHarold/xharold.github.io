<script setup lang="ts">
import { profile } from "../data/profile";
</script>

<template>
  <div class="contact-links">
    <span v-if="profile.email" class="contact-email">{{ profile.email }}</span>
    <span v-if="!profile.email" class="contact-pending">邮箱待补充</span>
  </div>
</template>
