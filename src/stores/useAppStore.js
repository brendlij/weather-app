import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const darkMode = ref(false);
  const location = ref({
    lat: 52.5170365,
    lon: 13.3888599,
  });

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

  return {
    darkMode,
    location,
    toggleDarkMode,
    setDarkMode,
    setLocation,
    clearLocation,
  };
});
