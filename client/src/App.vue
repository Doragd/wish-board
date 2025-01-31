<!-- src/App.vue -->
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
/* 全局样式 */
body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>