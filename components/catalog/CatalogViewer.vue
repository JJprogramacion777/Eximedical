<script setup lang="ts">
import type { Catalogo } from '~/utils/catalogos'

// Visor de PDF en ventana emergente. Se cierra con Esc o haciendo clic fuera.
const model = defineModel<Catalogo | null>({ required: true })
const close = () => (model.value = null)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

watch(model, (item) => {
  document.body.style.overflow = item ? 'hidden' : ''
  if (item) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="viewer">
      <div v-if="model" class="backdrop" @click.self="close">
        <div class="dialog" role="dialog" aria-modal="true" :aria-label="`Catálogo ${model.title}`">
          <header>
            <div class="title">
              <span class="t-icon"><AppIcon name="file-text" :size="20" /></span>
              <div>
                <strong>{{ model.title }}</strong>
                <small>PDF · {{ model.size }}</small>
              </div>
            </div>
            <div class="tools">
              <a :href="model.pdf" target="_blank" rel="noopener" class="tool" aria-label="Abrir en otra pestaña">
                <AppIcon name="external" :size="18" />
              </a>
              <a :href="model.pdf" :download="`Eximedical-${model.slug}.pdf`" class="tool gold" aria-label="Descargar">
                <AppIcon name="download" :size="18" />
              </a>
              <button class="tool" aria-label="Cerrar" @click="close"><AppIcon name="x" :size="20" /></button>
            </div>
          </header>
          <iframe :src="`${model.pdf}#view=FitH`" :title="model.title" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(17, 12, 56, 0.7);
  backdrop-filter: blur(8px);
}

.dialog {
  display: flex;
  flex-direction: column;
  width: min(1100px, 100%);
  height: min(88vh, 900px);
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--shadow-lg);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
}

.title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title strong {
  display: block;
  font-family: var(--font-display);
  color: var(--indigo-900);
}

.title small {
  color: var(--muted);
}

.t-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--indigo-100);
  color: var(--indigo-700);
}

.tools {
  display: flex;
  gap: 8px;
}

.tool {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 0;
  background: var(--bg);
  color: var(--indigo-900);
  transition: background 0.2s, transform 0.2s;
}

.tool:hover {
  background: var(--indigo-100);
  transform: translateY(-2px);
}

.tool.gold {
  background: var(--gold-500);
  color: var(--indigo-950);
}

iframe {
  flex: 1;
  width: 100%;
  border: 0;
  background: #525659;
}

.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 0.3s;
}

.viewer-enter-active .dialog,
.viewer-leave-active .dialog {
  transition: transform 0.45s var(--ease);
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

.viewer-enter-from .dialog,
.viewer-leave-to .dialog {
  transform: translateY(40px) scale(0.96);
}

@media (max-width: 600px) {
  .backdrop {
    padding: 0;
  }

  .dialog {
    height: 100dvh;
    border-radius: 0;
  }
}
</style>
