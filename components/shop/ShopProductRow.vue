<script setup lang="ts">
import type { Producto } from '~/utils/tienda'

// Carrusel horizontal de productos con flechas
defineProps<{ title: string, eyebrow: string, items: Producto[] }>()
const emit = defineEmits<{ quickview: [product: Producto] }>()

const track = ref<HTMLElement>()
const scroll = (dir: 1 | -1) => track.value?.scrollBy({ left: dir * track.value.clientWidth * 0.8, behavior: 'smooth' })
</script>

<template>
  <section v-if="items.length" class="row-section">
    <div class="head">
      <div>
        <span class="eyebrow">{{ eyebrow }}</span>
        <h2 class="section-title small">{{ title }}</h2>
      </div>
      <div class="arrows">
        <button aria-label="Anterior" @click="scroll(-1)"><AppIcon name="arrow-right" :size="18" class="flip" /></button>
        <button aria-label="Siguiente" @click="scroll(1)"><AppIcon name="arrow-right" :size="18" /></button>
      </div>
    </div>
    <div ref="track" class="track">
      <ShopProductCard v-for="p in items" :key="p.slug" :product="p" class="item" @quickview="emit('quickview', $event)" />
    </div>
  </section>
</template>

<style scoped>
.row-section {
  margin-top: 72px;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.section-title.small {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.arrows {
  display: flex;
  gap: 8px;
}

.arrows button {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  background: #fff;
  color: var(--indigo-900);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.arrows button:hover {
  background: var(--indigo-700);
  border-color: var(--indigo-700);
  color: #fff;
}

.flip {
  transform: rotate(180deg);
}

.track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(230px, 1fr);
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 6px 4px 20px;
  margin: 0 -4px;
  scrollbar-width: none;
}

.track::-webkit-scrollbar {
  display: none;
}

.item {
  scroll-snap-align: start;
}

@media (min-width: 1100px) {
  .track {
    grid-auto-columns: calc((100% - 60px) / 4);
  }
}

@media (max-width: 560px) {
  .track {
    grid-auto-columns: 70%;
  }
}
</style>
