<script setup lang="ts">
import type { Catalogo } from '~/utils/catalogos'

const props = defineProps<{ items: Catalogo[] }>()
const emit = defineEmits<{ open: [item: Catalogo] }>()

const groups = ['Todos', 'Equipamiento', 'Insumos', 'Especialidades'] as const
const group = ref<(typeof groups)[number]>('Todos')
const query = ref('')

// Búsqueda sin distinguir tildes ni mayúsculas
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const filtered = computed(() => {
  const q = normalize(query.value.trim())
  return props.items.filter(c =>
    (group.value === 'Todos' || c.group === group.value)
    && (!q || normalize(`${c.title} ${c.description}`).includes(q))
  )
})

// Inclinación 3D de la tarjeta según el cursor
const tilt = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -8}deg`)
  el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`)
}
const untilt = (e: PointerEvent) => {
  const el = e.currentTarget as HTMLElement
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head head">
        <div>
          <span v-reveal class="eyebrow">Todos los catálogos</span>
          <h2 v-reveal="{ delay: 100 }" class="section-title">Explora por <em>línea de producto</em></h2>
        </div>

        <label v-reveal="{ delay: 200 }" class="search">
          <AppIcon name="search" :size="20" />
          <input v-model="query" type="search" placeholder="Buscar catálogo..." aria-label="Buscar catálogo">
        </label>
      </div>

      <div class="chips" role="tablist" aria-label="Filtrar por grupo">
        <button
          v-for="g in groups"
          :key="g"
          class="chip"
          :class="{ active: group === g }"
          role="tab"
          :aria-selected="group === g"
          @click="group = g"
        >
          {{ g }}
          <span class="count">{{ g === 'Todos' ? items.length : items.filter(c => c.group === g).length }}</span>
        </button>
      </div>

      <TransitionGroup tag="div" name="card" class="grid">
        <article
          v-for="c in filtered"
          :key="c.slug"
          class="card"
          @pointermove="tilt"
          @pointerleave="untilt"
        >
          <div class="cover">
            <img :src="c.img" :alt="c.title" width="600" height="600" loading="lazy">
            <span class="badge"><AppIcon name="file-text" :size="14" /> PDF · {{ c.size }}</span>
            <button class="peek" :aria-label="`Ver catálogo ${c.title}`" @click="emit('open', c)">
              <AppIcon name="eye" :size="26" />
            </button>
          </div>
          <div class="info">
            <span class="group">{{ c.group }}</span>
            <h3>{{ c.title }}</h3>
            <p>{{ c.description }}</p>
            <div class="actions">
              <button class="link" @click="emit('open', c)">
                Ver <AppIcon name="arrow-right" :size="16" />
              </button>
              <a :href="c.pdf" :download="`Eximedical-${c.slug}.pdf`" class="dl" :aria-label="`Descargar ${c.title}`">
                <AppIcon name="download" :size="18" />
              </a>
            </div>
          </div>
        </article>
      </TransitionGroup>

      <p v-if="!filtered.length" class="empty">
        No encontramos catálogos para “{{ query }}”. Prueba con otra palabra o
        <NuxtLink to="/contacto">escríbenos</NuxtLink> y te ayudamos.
      </p>
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(340px, 100%);
  padding: 0 18px;
  height: 52px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--muted);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search:focus-within {
  border-color: var(--indigo-500);
  box-shadow: 0 0 0 4px rgba(81, 69, 214, 0.12);
}

.search input {
  flex: 1;
  border: 0;
  outline: 0;
  background: none;
  font: inherit;
  color: var(--ink);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 36px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--indigo-900);
  font-family: var(--font-display);
  font-weight: 500;
  transition: all 0.3s var(--ease);
}

.chip:hover {
  border-color: var(--indigo-500);
}

.chip.active {
  background: var(--indigo-700);
  border-color: var(--indigo-700);
  color: #fff;
  box-shadow: 0 10px 24px -10px rgba(47, 36, 144, 0.7);
}

.count {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  background: var(--indigo-100);
  color: var(--indigo-700);
}

.chip.active .count {
  background: var(--gold-500);
  color: var(--indigo-950);
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.card {
  --rx: 0deg;
  --ry: 0deg;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  overflow: hidden;
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.25s ease-out, box-shadow 0.4s var(--ease);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.cover {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s var(--ease);
}

.card:hover .cover img {
  transform: scale(1.08);
}

.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--indigo-900);
  font-size: 0.78rem;
  font-weight: 600;
  backdrop-filter: blur(6px);
}

.peek {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border: 0;
  color: #fff;
  background: rgba(17, 12, 56, 0.55);
  opacity: 0;
  transition: opacity 0.4s;
}

.peek .icon {
  width: 64px;
  height: 64px;
  padding: 18px;
  border-radius: 50%;
  background: var(--gold-500);
  color: var(--indigo-950);
  transform: scale(0.6);
  transition: transform 0.5s var(--ease);
}

.card:hover .peek,
.peek:focus-visible {
  opacity: 1;
}

.card:hover .peek .icon {
  transform: scale(1);
}

.info {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 22px 24px 24px;
}

.group {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-600);
}

h3 {
  margin-top: 6px;
  font-size: 1.35rem;
  color: var(--indigo-900);
}

.info p {
  margin-top: 8px;
  color: var(--muted);
  flex: 1;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: none;
  padding: 0;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--indigo-700);
}

.link .icon {
  transition: transform 0.3s var(--ease);
}

.link:hover .icon {
  transform: translateX(5px);
}

.dl {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--indigo-100);
  color: var(--indigo-700);
  transition: background 0.3s, color 0.3s, transform 0.3s var(--ease);
}

.dl:hover {
  background: var(--gold-500);
  color: var(--indigo-950);
  transform: translateY(-3px);
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
}

.empty a {
  color: var(--indigo-700);
  font-weight: 600;
  text-decoration: underline;
}

/* Animación al filtrar: las tarjetas que salen desaparecen al instante y las que entran aparecen con zoom */
.card-enter-active {
  transition: opacity 0.45s var(--ease), transform 0.45s var(--ease);
}

.card-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.card-leave-active {
  display: none;
}

.card-move {
  transition: transform 0.5s var(--ease);
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
