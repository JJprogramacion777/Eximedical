<script setup lang="ts">
const categories = [
  {
    title: 'Equipos médicos',
    text: 'Tecnología para diagnóstico, monitoreo y cuidado del paciente en hospitales, clínicas y consultorios.',
    img: '/images/cat/equipos-medicos.png',
    to: '/tienda/equipos-medicos'
  },
  {
    title: 'Mobiliario',
    text: 'Camillas, mesas quirúrgicas, portasueros y mobiliario hospitalario resistente.',
    img: '/images/cat/mobiliarios.png',
    to: '/tienda/mobiliario'
  },
  {
    title: 'Instrumental quirúrgico',
    text: 'Instrumental de alta precisión para cada especialidad.',
    img: '/images/cat/instrumental.png',
    to: '/tienda/instrumental-quirurgico'
  },
  {
    title: 'Descartables',
    text: 'Insumos de un solo uso para una atención segura e higiénica.',
    img: '/images/cat/descartables.png',
    to: '/tienda/descartables'
  },
  {
    title: 'Anatómicos',
    text: 'Modelos anatómicos para docencia, consulta y capacitación.',
    img: '/images/cat/anatomicos.png',
    to: '/tienda/anatomicos'
  }
]

// Efecto "linterna": el brillo de la tarjeta sigue al cursor
const spotlight = (e: PointerEvent) => {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
</script>

<template>
  <section id="categorias" class="section">
    <div class="container">
      <div class="section-head center">
        <span v-reveal class="eyebrow">Nuestras líneas</span>
        <h2 v-reveal="{ delay: 100 }" class="section-title">Todo lo que tu centro de salud <em>necesita</em></h2>
        <p v-reveal="{ delay: 200 }" class="section-lead">
          Cinco líneas de producto seleccionadas de marcas reconocidas, listas para equipar cada área de atención.
        </p>
      </div>

      <div class="grid">
        <NuxtLink
          v-for="(c, i) in categories"
          :key="c.title"
          v-reveal="{ delay: i * 90 }"
          :to="c.to"
          class="card"
          :class="{ featured: i === 0 }"
          @pointermove="spotlight"
        >
          <div class="icon-wrap">
            <img :src="c.img" :alt="''" width="300" height="300" loading="lazy">
          </div>
          <h3>{{ c.title }}</h3>
          <p>{{ c.text }}</p>
          <span class="more">Ver productos <AppIcon name="arrow-right" :size="16" /></span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  --mx: 50%;
  --my: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease), border-color 0.3s;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(360px circle at var(--mx) var(--my), rgba(47, 208, 212, 0.16), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow);
  border-color: rgba(47, 208, 212, 0.5);
}

.card:hover::before {
  opacity: 1;
}

.featured {
  grid-row: span 2;
  justify-content: flex-end;
  color: #fff;
  border: 0;
  background:
    radial-gradient(120% 80% at 100% 0%, rgba(47, 208, 212, 0.35), transparent 60%),
    linear-gradient(160deg, var(--indigo-700), var(--indigo-950));
}

.featured::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background: url('/images/srv-equipos.png') center 20% / 75% no-repeat;
  opacity: 0.14;
  transition: transform 0.8s var(--ease);
}

.featured:hover::after {
  transform: scale(1.08);
}

.icon-wrap {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  margin-bottom: 22px;
  box-shadow: 0 12px 30px -10px rgba(47, 208, 212, 0.7);
  transition: transform 0.6s var(--ease);
}

.featured .icon-wrap {
  width: 104px;
  height: 104px;
}

.card:hover .icon-wrap {
  transform: rotate(-10deg) scale(1.08);
}

.icon-wrap img {
  width: 100%;
  height: 100%;
}

h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--indigo-900);
}

.featured h3 {
  color: #fff;
  font-size: 2rem;
}

p {
  margin-top: 10px;
  color: var(--muted);
  flex: 1;
}

.featured p {
  color: rgba(255, 255, 255, 0.78);
  flex: 0;
  font-size: 1.05rem;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--indigo-700);
}

.featured .more {
  color: var(--gold-300);
}

.more .icon {
  transition: transform 0.3s var(--ease);
}

.card:hover .more .icon {
  transform: translateX(6px);
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured {
    grid-column: span 2;
    grid-row: auto;
    min-height: 320px;
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .featured {
    grid-column: auto;
  }
}
</style>
