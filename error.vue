<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: () => (is404.value ? 'Página no encontrada | Eximedical' : 'Error | Eximedical') })

const goHome = () => clearError({ redirect: '/' })
const goShop = () => clearError({ redirect: '/tienda' })
</script>

<template>
  <NuxtLayout>
    <section class="error">
      <div class="bg" aria-hidden="true">
        <span class="blob b1" />
        <span class="blob b2" />
      </div>
      <div class="container inner">
        <svg viewBox="0 0 320 60" class="ecg" aria-hidden="true">
          <path d="M0 30 H110 L122 10 L134 50 L146 4 L158 56 L170 30 H320" />
        </svg>
        <p class="code">{{ error.statusCode }}</p>
        <h1>{{ is404 ? 'No encontramos esta página' : 'Algo salió mal' }}</h1>
        <p class="text">
          {{ is404
            ? 'Es posible que el enlace haya cambiado o que el producto ya no esté disponible.'
            : 'Ocurrió un error inesperado. Intenta nuevamente en unos segundos.' }}
        </p>
        <div class="actions">
          <button class="btn" @click="goHome">Volver al inicio</button>
          <button class="btn btn-ghost" @click="goShop">Ir a la tienda <AppIcon name="arrow-right" :size="18" /></button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error {
  position: relative;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: calc(var(--header-h) + 80px) 0 80px;
  text-align: center;
  color: #fff;
  background: radial-gradient(120% 120% at 20% 10%, var(--indigo-700), var(--indigo-950) 70%);
  overflow: hidden;
  isolation: isolate;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}

.b1 {
  width: 400px;
  height: 400px;
  background: var(--teal-500);
  bottom: -120px;
  right: 10%;
}

.b2 {
  width: 320px;
  height: 320px;
  background: var(--gold-500);
  top: -80px;
  left: 5%;
}

.ecg {
  width: min(320px, 80%);
  margin: 0 auto;
}

.ecg path {
  fill: none;
  stroke: var(--teal-300);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: draw 2.4s linear infinite;
}

@keyframes draw {
  60% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -420; }
}

.code {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(5rem, 16vw, 9rem);
  line-height: 1;
  background: linear-gradient(90deg, var(--gold-300), var(--teal-300));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

h1 {
  margin-top: 8px;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
}

.text {
  margin: 14px auto 0;
  max-width: 480px;
  color: rgba(255, 255, 255, 0.75);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 32px;
}
</style>
