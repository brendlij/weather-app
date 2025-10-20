<template>
  <div class="header">
    <h1 class="title">
      <Sun color="#ff8282" :size="32" />
      Weather App
    </h1>
    <Switch v-model="appStore.darkMode" class="dark-light-sw" />
  </div>
</template>

<script setup>
import { Sun } from "lucide-vue-next";
import Switch from "./Switch.vue";
import { useAppStore } from "@/stores/useAppStore";
const appStore = useAppStore();
</script>

<style scoped>
.header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 5em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.8rem;
  margin-left: 1rem;
}

.dark-light-sw {
  margin-left: auto;
  margin-right: 1em;
}
</style>
