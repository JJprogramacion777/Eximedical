<script setup lang="ts">
const brands = [
  { name: 'Riester', img: '/images/brands/riester.jpg' },
  { name: 'Beurer', img: '/images/brands/beurer.jpg' },
  { name: 'Yuwell', img: '/images/brands/yuwel.jpg' },
  { name: 'Roscoe Medical', img: '/images/brands/roscoe.jpg' },
  { name: 'MedicLife', img: '/images/brands/mediclife.jpg' },
  { name: 'PS Medics', img: '/images/brands/psmedics.jpg' },
  { name: 'K&I Equipos Médicos', img: '/images/brands/k.jpg' },
  { name: 'TheraMart', img: '/images/brands/theramart.jpg' },
  { name: 'SM Safe Medic', img: '/images/brands/safy-medic.jpg' },
  { name: 'Carlitos', img: '/images/brands/carlitos.jpg' },
  { name: 'Drive DeVilbiss Healthcare', img: '/images/brands/drive.jpg' }
]

const rowA = brands.slice(0, 6)
const rowB = brands.slice(6)
</script>

<template>
  <section class="section brands">
    <div class="container section-head center">
      <span v-reveal class="eyebrow">Marcas aliadas</span>
      <h2 v-reveal="{ delay: 100 }" class="section-title">Trabajamos con marcas <em>líderes</em> en calidad e innovación</h2>
    </div>

    <div v-for="(row, r) in [rowA, rowB]" :key="r" class="belt" :class="{ reverse: r === 1 }">
      <div class="track">
        <template v-for="copy in 4" :key="copy">
          <div v-for="b in row" :key="`${copy}-${b.name}`" class="logo" :aria-hidden="copy > 1">
            <img :src="b.img" :alt="b.name" loading="lazy" width="200" height="125">
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brands {
  background: var(--surface);
  overflow: hidden;
}

.belt {
  overflow: hidden;
  padding-block: 10px;
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: slide 45s linear infinite;
}

.reverse .track {
  animation-direction: reverse;
}

.belt:hover .track {
  animation-play-state: paused;
}

.logo {
  display: grid;
  place-items: center;
  width: 200px;
  height: 110px;
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: #fff;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.3s;
}

.logo img {
  max-height: 80px;
  width: auto;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.7;
  transition: filter 0.4s, opacity 0.4s;
}

.logo:hover {
  transform: translateY(-4px) scale(1.04);
  box-shadow: var(--shadow);
  border-color: transparent;
}

.logo:hover img {
  filter: none;
  opacity: 1;
}

/* 4 copias de la fila: avanzar un cuarto la deja en la misma posición visual */
@keyframes slide {
  to { transform: translateX(calc(-25% - 6px)); }
}
</style>
