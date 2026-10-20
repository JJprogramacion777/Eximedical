<script setup lang="ts">
// Banner superior reutilizable para las páginas internas (Nosotros, Catálogo, Contacto...)
defineProps<{
  title: string
  highlight?: string
  subtitle?: string
  crumb: string
  image?: string
  imagePosition?: string
}>()
</script>

<template>
  <section class="page-hero">
    <div class="bg" aria-hidden="true">
      <img v-if="image" :src="image" alt="" class="photo" :style="{ objectPosition: imagePosition ?? 'center' }">
      <span class="overlay" />
      <span class="grid" />
      <span class="blob b1" />
      <span class="blob b2" />
    </div>

    <div class="container inner">
      <nav class="crumbs" aria-label="Ruta de navegación">
        <NuxtLink to="/">Inicio</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ crumb }}</span>
      </nav>
      <h1>
        {{ title }}
        <em v-if="highlight">{{ highlight }}</em>
      </h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>

    <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 40 C 320 90 560 0 860 30 S 1260 70 1440 20 V80 H0 Z" />
    </svg>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  min-height: 62svh;
  display: flex;
  align-items: center;
  padding: calc(var(--header-h) + 90px) 0 130px;
  color: #fff;
  background: var(--indigo-950);
  overflow: hidden;
  isolation: isolate;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ken-burns 20s ease-out both;
}

@keyframes ken-burns {
  from { transform: scale(1.18); }
  to { transform: scale(1.02); }
}

.overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(100deg, rgba(17, 12, 56, 0.96) 0%, rgba(27, 20, 82, 0.85) 45%, rgba(47, 36, 144, 0.55) 100%);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(90deg, #000, transparent 70%);
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: drift 16s ease-in-out infinite alternate;
}

.b1 {
  width: 380px;
  height: 380px;
  background: var(--teal-500);
  opacity: 0.25;
  bottom: -160px;
  left: 30%;
}

.b2 {
  width: 300px;
  height: 300px;
  background: var(--gold-500);
  opacity: 0.22;
  top: -100px;
  right: 8%;
  animation-delay: -8s;
}

@keyframes drift {
  to { transform: translate(50px, 30px) scale(1.15); }
}

.inner > * {
  animation: fade-up 1s var(--ease) both;
}

.inner > :nth-child(2) { animation-delay: 0.12s; }
.inner > :nth-child(3) { animation-delay: 0.24s; }

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
}

.crumbs {
  display: inline-flex;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.crumbs a:hover {
  color: var(--gold-300);
}

.crumbs [aria-current] {
  color: var(--gold-300);
  font-weight: 600;
}

h1 {
  margin-top: 22px;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 700;
  max-width: 820px;
}

h1 em {
  font-style: normal;
  background: linear-gradient(90deg, var(--gold-300), var(--gold-500) 40%, var(--teal-300));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  margin-top: 20px;
  max-width: 600px;
  font-size: 1.12rem;
  color: rgba(255, 255, 255, 0.8);
}

.wave {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 80px;
}

.wave path {
  fill: var(--bg);
}
</style>
