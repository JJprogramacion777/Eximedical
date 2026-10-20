<script setup lang="ts">
// Ventana de confirmación para acciones que no se pueden deshacer
const open = defineModel<boolean>({ required: true })
defineProps<{ title: string, message: string, confirmLabel?: string, loading?: boolean }>()
const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="pop">
      <div v-if="open" class="backdrop" @click.self="!loading && (open = false)">
        <div class="box" role="alertdialog" aria-modal="true" :aria-label="title">
          <span class="warn"><AppIcon name="x" :size="26" /></span>
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="actions">
            <button class="btn-plain" :disabled="loading" @click="open = false">Cancelar</button>
            <button class="btn-danger" :disabled="loading" @click="emit('confirm')">
              {{ loading ? 'Eliminando...' : confirmLabel ?? 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(17, 12, 56, 0.55);
  backdrop-filter: blur(4px);
}

.box {
  width: min(420px, 100%);
  padding: 30px 28px 24px;
  border-radius: 22px;
  background: #fff;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.warn {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #fde8e8;
  color: #d03c3c;
}

h3 {
  font-size: 1.25rem;
  color: var(--indigo-900);
}

p {
  margin-top: 8px;
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.actions button {
  flex: 1;
  height: 46px;
  border-radius: 12px;
  font-weight: 600;
}

.btn-plain {
  border: 1.5px solid var(--line);
  background: #fff;
  color: var(--indigo-900);
}

.btn-danger {
  border: 0;
  background: #d03c3c;
  color: #fff;
}

.btn-danger:hover {
  background: #b42323;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.25s;
}

.pop-enter-active .box,
.pop-leave-active .box {
  transition: transform 0.3s var(--ease);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

.pop-enter-from .box,
.pop-leave-to .box {
  transform: scale(0.92);
}
</style>
