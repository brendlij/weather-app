import { defineStore } from "pinia";
import { ref } from "vue";
import { getWeather } from "@/utils/weather.js"; // ⬅️ nutzt deine API-Helper-Datei

export const useAppStore = defineStore("app", () => {
  const darkMode = ref(false);

  // Default auf Berlin
  const location = ref({
    lat: 52.5170365,
    lon: 13.3888599,
  });

  const weather = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
  };

  const setDarkMode = (value) => {
    darkMode.value = value;
  };

  const setLocation = (lat, lon) => {
    location.value = { lat, lon };
  };

  const clearLocation = () => {
    location.value = { lat: null, lon: null };
  };

  // 🔥 Wetter laden basierend auf location
  const loadWeather = async () => {
    if (!location.value.lat || !location.value.lon) return;

    loading.value = true;
    error.value = null;
    try {
      weather.value = await getWeather({
        lat: location.value.lat,
        lon: location.value.lon,
        lang: "de",
        units: "metric",
      });
    } catch (e) {
      error.value = e.message;
      weather.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    darkMode,
    location,
    weather,
    error,
    loading,
    toggleDarkMode,
    setDarkMode,
    setLocation,
    clearLocation,
    loadWeather,
  };
});
