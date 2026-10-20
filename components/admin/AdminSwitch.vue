<script setup lang="ts">
const value = defineModel<boolean>({ required: true })
defineProps<{ label?: string, hint?: string, disabled?: boolean }>()
</script>

<template>
  <label class="switch" :class="{ disabled }">
    <input v-model="value" type="checkbox" :disabled="disabled">
    <span class="track"><span class="thumb" /></span>
    <span v-if="label" class="text">
      <strong>{{ label }}</strong>
      <small v-if="hint">{{ hint }}</small>
    </span>
  </label>
</template>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.switch.disabled {
  opacity: 0.5;
  cursor: wait;
}

input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.track {
  position: relative;
  width: 44px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 999px;
  background: #cfd0dd;
  transition: background 0.25s;
}

.thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s var(--ease);
}

input:checked + .track {
  background: #25b86b;
}

input:checked + .track .thumb {
  transform: translateX(18px);
}

input:focus-visible + .track {
  outline: 3px solid rgba(81, 69, 214, 0.35);
  outline-offset: 2px;
}

.text strong {
  display: block;
  font-size: 0.95rem;
  color: var(--indigo-900);
}

.text small {
  color: var(--muted);
  font-size: 0.82rem;
}
</style>
