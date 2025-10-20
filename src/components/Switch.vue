<script setup>
import { computed } from "vue";

// Definiert die Props, die der Komponente übergeben werden können.
// Wir nutzen 'modelValue', da dies die Standard-Prop für v-model ist.
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false, // Standardwert ist "aus"
  },
  label: {
    type: String,
    default: "",
  },
});

// Definiert die Events, die die Komponente emittieren kann.
// Bei v-model ist dies 'update:modelValue'.
const emit = defineEmits(["update:modelValue"]);

// Ein computed property, das als Getter und Setter fungiert,
// um das v-model korrekt zu handhaben.
const internalValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    // Wenn der Wert geändert wird, emittieren wir das Update-Event.
    emit("update:modelValue", newValue);
  },
});

// Die Funktion, die beim Klicken auf den Switch den Wert umschaltet.
const toggle = () => {
  internalValue.value = !internalValue.value;
};
</script>

<template>
  <label class="switch-container">
    <span class="switch-label">{{ label }}</span>
    <div
      class="switch-control"
      :class="{ 'is-checked': internalValue }"
      @click="toggle"
    >
      <div class="switch-thumb"></div>
    </div>
  </label>
</template>

<style scoped>
.switch-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.switch-label {
  font-weight: 500;
  color: #333;
}

.switch-control {
  width: 50px; /* Breite des Switches */
  height: 26px; /* Höhe des Switches */
  background-color: #ccc; /* Farbe, wenn 'Aus' */
  border-radius: 13px; /* Rundung */
  position: relative;
  transition: background-color 0.3s;
}

.switch-control.is-checked {
  background-color: #4caf50; /* Farbe, wenn 'An' (grün) */
}

.switch-thumb {
  width: 20px; /* Größe des Knopfes */
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 3px; /* Zentriert den Knopf vertikal (26px Höhe - 20px Knopf / 2 = 3px Abstand) */
  left: 3px; /* Startposition links */
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.switch-control.is-checked .switch-thumb {
  /* Bewegt den Knopf nach rechts: (50px Breite - 3px linker Abstand - 20px Knopf - 3px rechter Abstand) */
  transform: translateX(24px);
}

.switch-status {
  font-size: 0.9em;
  color: #666;
}
</style>
