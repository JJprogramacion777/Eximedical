<script setup lang="ts">
// Panel lateral para formularios de crear/editar
const open = defineModel<boolean>({ required: true })
defineProps<{ title: string, subtitle?: string }>()

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}
watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="backdrop" @click="open = false" />
    </Transition>
    <Transition name="slide">
      <aside v-if="open" class="drawer" role="dialog" aria-modal="true" :aria-label="title">
        <header>
          <div>
            <h2>{{ title }}</h2>
            <small v-if="subtitle">{{ subtitle }}</small>
          </div>
          <button class="close" aria-label="Cerrar" @click="open = false"><AppIcon name="x" :size="20" /></button>
        </header>
        <div class="body">
          <slot />
        </div>
        <footer v-if="$slots.footer">
          <slot name="footer" />
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(17, 12, 56, 0.5);
  backdrop-filter: blur(3px);
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 91;
  width: min(560px, 100%);
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: var(--shadow-lg);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 26px;
  border-bottom: 1px solid var(--line);
}

h2 {
  font-size: 1.35rem;
  color: var(--indigo-900);
}

header small {
  color: var(--muted);
}

.close {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 0;
  background: var(--bg);
  color: var(--indigo-900);
  transition: transform 0.3s var(--ease);
}

.close:hover {
  transform: rotate(90deg);
}

.body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 26px;
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 26px;
  border-top: 1px solid var(--line);
  background: var(--bg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s var(--ease);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
