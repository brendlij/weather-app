<script setup>
import Header from "./components/Header.vue";
import Weather from "./components/Weather.vue";
import Search from "./components/Search.vue";
import { useAppStore } from "@/stores/useAppStore.js";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const app = useAppStore();
const { weather, error, loading } = storeToRefs(app);

async function onPick(c) {
  if (!c || typeof c.lat !== 'number' || typeof c.lon !== 'number') {
    app.$patch({ error: "Ungültiger Ort" });
    return;
  }
  app.setLocation(c.lat, c.lon);
  await app.loadWeather();
}

// Optional: Beim App-Start direkt Wetter für Default-Location laden
onMounted(() => {
  app.loadWeather().catch(() => {});
});
</script>

<template>
  <div class="app">
    <Header />
    <Search @select="onPick" />

    <div class="weather">
      <!-- Wenn du beim Refresh keinen Stale-Content willst, stell loading nach oben -->
      <p v-if="loading">⏳ Lädt...</p>
      <p v-else-if="error">❌ {{ error }}</p>
      <Weather v-else-if="weather" :data="weather" :key="weather?.id ?? weather?.dt" />
      <p v-else>🌤️ Bitte Ort auswählen...</p>
    </div>
  </div>
</template>

<style scoped>
.app { text-align: center; color: #2c3e50; margin: 20px; }
.weather { margin-top: 20px; }
</style>
