<template>
  <div class="search">
    <div class="input-wrap">
      <input
        ref="inputEl"
        v-model="q"
        type="search"
        placeholder="Search for a city..."
        @focus="isOpen = !!q.trim()"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="choose(activeIndex)"
        @keydown.esc.prevent="close()"
        autocomplete="off"
        role="combobox"
        :aria-expanded="showList"
      />
      <Transition name="fade">
        <X v-if="q" class="clear" :size="22" @click="clearInput" color="#666" />
      </Transition>
    </div>

    <div class="list-wrap">
      <Transition name="pop">
        <ul v-if="showList" role="listbox">
          <li
            v-for="(c, i) in results"
            :key="i"
            :class="{ active: i === activeIndex }"
            @mousedown.prevent="choose(i)"
            role="option"
          >
            {{ label(c) }}
          </li>
          <li v-if="loading" class="muted">Searching...</li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { X } from "lucide-vue-next";
import { useAppStore } from "@/stores/useAppStore";

const emit = defineEmits(["select"]);
const appStore = useAppStore();
const q = ref("");
const results = ref([]);
const activeIndex = ref(0);
const loading = ref(false);
const isOpen = ref(false);
const skipNextWatch = ref(false);
const inputEl = ref(null);
let t;

const API = "https://api.openweathermap.org/geo/1.0/direct";
const KEY = import.meta.env.VITE_OWM_KEY;

function close() {
  isOpen.value = false;
  results.value = [];
}

function clearInput() {
  q.value = "";
  close();
  inputEl.value?.focus();
}

watch(q, (val) => {
  clearTimeout(t);

  if (skipNextWatch.value) {
    skipNextWatch.value = false;
    return; // Auswahl gesetzt -> keine neue Suche
  }

  const v = val.trim();
  if (!v) {
    close();
    return;
  }

  isOpen.value = true;
  t = setTimeout(fetchCities, 300); // debounce
});

async function fetchCities() {
  if (!KEY) return;
  loading.value = true;
  try {
    const url = new URL(API);
    url.searchParams.set("q", q.value);
    url.searchParams.set("limit", "5");
    url.searchParams.set("appid", KEY);
    const r = await fetch(url);
    results.value = r.ok ? await r.json() : [];
    activeIndex.value = 0;
    // Wenn keine Ergebnisse und nicht loading -> Dropdown zu
    if (!loading.value && results.value.length === 0) isOpen.value = false;
  } catch {
    results.value = [];
    isOpen.value = false;
  } finally {
    loading.value = false;
  }
}

function choose(i) {
  const c = results.value[i];
  if (!c) return;
  emit("select", { name: label(c), lat: c.lat, lon: c.lon });
  skipNextWatch.value = true; // verhindert Re-Search
  q.value = label(c); // im Input anzeigen
  close();
  inputEl.value?.blur(); // optional: Fokus weg
  appStore.setLocation(c.lat, c.lon);
}

function move(dir) {
  if (!results.value.length) return;
  activeIndex.value =
    (activeIndex.value + dir + results.value.length) % results.value.length;
}

const label = (c) => `${c.name}${c.state ? ", " + c.state : ""} · ${c.country}`;

// Dropdown nur, wenn explizit offen UND (lädt oder Ergebnisse da)
const showList = computed(
  () => isOpen.value && (loading.value || results.value.length > 0)
);
</script>

<style scoped>
/* Layout */
.search {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
}
.input-wrap,
.list-wrap {
  position: relative;
  width: 60%;
  margin: 0 auto;
}

/* Input */
input {
  background-color: #f8f9fa;
  width: 100%;
  height: 50px;
  padding: 0.7rem 2.5rem 0.7rem 1rem; /* Platz rechts fürs X */
  border-radius: 3em;
  border: none;
  outline: none;
  font-size: 1rem;
}

/* Lucide X */
.clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: 0.2s ease;
}
.clear:hover {
  color: #000;
  transform: translateY(-50%) scale(1.1);
}

/* Native Search-X ausblenden */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

/* Dropdown */
ul {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #f8f9fa;
  border: none;
  border-radius: 12px;
  margin-top: 0.4rem;
  overflow: hidden;
  z-index: 20;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  list-style: none;
  padding: 0;
}
li {
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  cursor: pointer;
  line-height: 1.3;
  text-align: center;
  white-space: normal;
  word-break: break-word;
}
li:hover {
  background: #eef2f7;
}
li.active {
  background: #e6f0ff;
}
.muted {
  color: #6b7280;
  cursor: default;
  text-align: center;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.9);
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease, clip-path 0.18s ease;
  transform-origin: top center;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  clip-path: inset(8px 12px 90% 12px round 12px);
}
</style>
