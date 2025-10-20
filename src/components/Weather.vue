<script setup>
import { computed } from "vue";
import { Sun, CloudRain, Wind, Moon } from "lucide-vue-next"; // ✅ Icons
const props = defineProps({
  data: { type: Object, required: true },
});

const name = computed(() => props.data?.name || "Unbekannt");
const main = computed(() => props.data?.main || null);
const wx   = computed(() =>
  Array.isArray(props.data?.weather) && props.data.weather.length ? props.data.weather[0] : null
);

const temp      = computed(() => (main.value ? Math.round(main.value.temp) : null));
const feelsLike = computed(() => (main.value ? Math.round(main.value.feels_like) : null));
const humidity  = computed(() => (main.value ? main.value.humidity : null));
const wind      = computed(() => props.data?.wind || null);

// simple icon logic
const iconComponent = computed(() => {
  const desc = wx.value?.main?.toLowerCase() || "";
  if (desc.includes("rain")) return CloudRain;
  if (desc.includes("cloud")) return Moon;
  if (desc.includes("wind")) return Wind;
  return Sun;
});
</script>

<template>
  <div class="weather-card">
    <h2>{{ name }}</h2>

    <div v-if="temp !== null" class="row">
      <!-- dynamic lucide icon -->
      <component :is="iconComponent" class="icon" :size="60" stroke-width="1.75" />
      <div class="temp">
        <div class="t">{{ temp }}°C</div>
        <div class="d">{{ wx?.description || "—" }}</div>
      </div>
    </div>

    <div class="meta">
      <span v-if="feelsLike !== null">Gefühlt: {{ feelsLike }}°C</span>
      <span v-if="humidity !== null">| Feuchte: {{ humidity }}%</span>
      <span v-if="wind?.speed !== undefined">| Wind: {{ Math.round(wind.speed * 3.6) }} km/h</span>
    </div>

    <p v-if="temp === null">Keine Wetterdetails verfügbar.</p>
  </div>
</template>

<style scoped>
.weather-card {
  padding: 1.25rem;
  background: linear-gradient(135deg, #eef3f6, #f7fafb);
  border-radius: 1.25rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  max-width: 300px;
  margin: 0 auto;
  transition: all 0.2s ease;
}
.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .8rem;
  margin: .5rem 0;
}

.icon {
  color: #f2c94c;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
}

.temp .t {
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1;
}

.temp .d {
  opacity: 0.8;
  text-transform: capitalize;
}

.meta {
  margin-top: .5rem;
  font-size: .9rem;
  opacity: .8;
}
</style>
