<script setup lang="ts">
import type { Catalogo } from '~/utils/catalogos'

const props = defineProps<{ item: Catalogo }>()
const emit = defineEmits<{ open: [item: Catalogo] }>()
</script>

<template>
  <section class="section featured-section">
    <div class="container">
      <article v-reveal="{ from: 'zoom' }" class="featured">
        <div class="media">
          <img :src="props.item.img" :alt="props.item.title" width="600" height="600">
          <span class="tag"><AppIcon name="award" :size="16" /> Nuevo</span>
        </div>

        <div class="body">
          <span class="eyebrow light">Catálogo destacado</span>
          <h2>{{ props.item.title }}</h2>
          <p>{{ props.item.description }}</p>

          <ul class="meta">
            <li><AppIcon name="file-text" :size="18" /> PDF · {{ props.item.size }}</li>
            <li><AppIcon name="package" :size="18" /> {{ props.item.group }}</li>
          </ul>

          <div class="actions">
            <button class="btn" @click="emit('open', props.item)">
              Ver catálogo <AppIcon name="arrow-right" :size="18" />
            </button>
            <a :href="props.item.pdf" :download="`Eximedical-${props.item.slug}.pdf`" class="btn btn-ghost">
              <AppIcon name="download" :size="18" /> Descargar
            </a>
          </div>
        </div>

        <!-- Hojas decorativas que se abren en abanico al pasar el mouse -->
        <div class="pages" aria-hidden="true">
          <span /><span /><span />
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.featured-section {
  padding-bottom: 0;
}

.featured {
  position: relative;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  border-radius: 32px;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(70% 120% at 100% 0%, rgba(47, 208, 212, 0.3), transparent 60%),
    linear-gradient(135deg, var(--indigo-700), var(--indigo-950));
  box-shadow: var(--shadow-lg);
  isolation: isolate;
}

.media {
  position: relative;
  min-height: 360px;
  overflow: hidden;
}

.media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease);
}

.media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 50%, rgba(37, 27, 112, 0.9));
}

.featured:hover .media img {
  transform: scale(1.06);
}

.tag {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--gold-500);
  color: var(--indigo-950);
  font-weight: 700;
  font-size: 0.85rem;
  animation: pulse-tag 2.4s ease-in-out infinite;
}

@keyframes pulse-tag {
  50% { box-shadow: 0 0 0 10px rgba(201, 161, 59, 0); transform: scale(1.04); }
  0%, 100% { box-shadow: 0 0 0 0 rgba(201, 161, 59, 0.6); }
}

.body {
  padding: clamp(32px, 5vw, 64px);
  position: relative;
  z-index: 1;
}

.eyebrow.light {
  color: var(--gold-300);
}

h2 {
  margin-top: 14px;
  font-size: clamp(2rem, 4vw, 3rem);
}

.body p {
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.08rem;
  max-width: 460px;
}

.meta {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}

.pages {
  position: absolute;
  right: 40px;
  bottom: -40px;
  width: 150px;
  height: 190px;
  z-index: 0;
  opacity: 0.18;
}

.pages span {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  border: 2px solid #fff;
  background: rgba(255, 255, 255, 0.05);
  transform-origin: bottom center;
  transition: transform 0.7s var(--ease);
}

.featured:hover .pages span:nth-child(1) { transform: rotate(-14deg) translateX(-20px); }
.featured:hover .pages span:nth-child(3) { transform: rotate(12deg) translateX(20px); }

@media (max-width: 860px) {
  .featured {
    grid-template-columns: 1fr;
  }

  .media {
    min-height: 260px;
  }

  .media::after {
    background: linear-gradient(180deg, transparent 50%, rgba(37, 27, 112, 0.9));
  }
}
</style>
