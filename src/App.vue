<script setup>
import Header from "./components/Header.vue";
import Weather from "./components/Weather.vue";
import Search from "./components/Search.vue";
import { ref } from "vue";

const place = ref(null);
function onPick(c) {
  place.value = c;
  // hier dein Wetter-Call:
  // loadWeather(c.lat, c.lon)
}
</script>

<template>
  <div class="app">
    <div class="header">
      <Header />
    </div>
    <div class="searchbar">
      <Search @select="onPick" />
    </div>
    <div class="weather">
      <Weather />
    </div>
  </div>
</template>

<style scoped>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px;
}

.header {
  padding: 10px;
}

.weather {
  margin-top: 20px;
}
</style>
