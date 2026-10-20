<script setup lang="ts">
// TODO: reemplazar por cifras reales de la empresa (años de experiencia, clientes atendidos, etc.)
const stats = [
  { value: 10, prefix: '+', suffix: '', label: 'Marcas internacionales aliadas' },
  { value: 5, prefix: '', suffix: '', label: 'Líneas de producto especializadas' },
  { value: 100, prefix: '', suffix: '%', label: 'Enfocados en el sector salud' }
]

const steps = [
  { icon: 'headset', title: 'Asesoría', text: 'Escuchamos tu necesidad y te recomendamos el equipo ideal.' },
  { icon: 'clipboard', title: 'Cotización', text: 'Recibes una propuesta clara, rápida y sin compromiso.' },
  { icon: 'truck', title: 'Importación y entrega', text: 'Gestionamos la importación y entregamos en tu centro de salud.' },
  { icon: 'wrench', title: 'Soporte técnico', text: 'Instalación, capacitación y mantenimiento especializado.' }
]

// Contadores que suben al aparecer en pantalla
const statsEl = ref<HTMLElement>()
const shown = ref(stats.map(() => 0))
const stepsEl = ref<HTMLElement>()
const stepsVisible = ref(false)

const countUp = () => {
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / 1800, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    shown.value = stats.map(s => Math.round(s.value * eased))
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      if (e.target === statsEl.value) countUp()
      if (e.target === stepsEl.value) stepsVisible.value = true
      io.unobserve(e.target)
    }
  }, { threshold: 0.35 })
  if (statsEl.value) io.observe(statsEl.value)
  if (stepsEl.value) io.observe(stepsEl.value)
})
</script>

<template>
  <section class="section why">
    <div class="container">
      <div ref="statsEl" class="stats">
        <div v-for="(s, i) in stats" :key="s.label" v-reveal="{ delay: i * 120 }" class="stat">
          <span class="num">{{ s.prefix }}{{ shown[i] }}{{ s.suffix }}</span>
          <span class="label">{{ s.label }}</span>
        </div>
      </div>

      <div class="section-head center">
        <span v-reveal class="eyebrow">¿Cómo trabajamos?</span>
        <h2 v-reveal="{ delay: 100 }" class="section-title">Un proceso simple, <em>de principio a fin</em></h2>
      </div>

      <ol ref="stepsEl" class="steps" :class="{ visible: stepsVisible }">
        <li v-for="(s, i) in steps" :key="s.title" class="step" :style="{ '--i': i }">
          <span class="step-icon"><AppIcon :name="s.icon" :size="26" /></span>
          <span class="step-num">Paso {{ i + 1 }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.why {
  background:
    radial-gradient(40% 40% at 100% 0%, rgba(81, 69, 214, 0.08), transparent),
    var(--bg);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: clamp(72px, 10vw, 120px);
}

.stat {
  padding: 32px;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--line);
  text-align: center;
}

.num {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.8rem, 6vw, 4rem);
  line-height: 1;
  background: linear-gradient(135deg, var(--indigo-700), var(--teal-500));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-variant-numeric: tabular-nums;
}

.label {
  display: block;
  margin-top: 10px;
  color: var(--muted);
}

.steps {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Línea que conecta los pasos y se dibuja al aparecer */
.steps::before {
  content: '';
  position: absolute;
  top: 36px;
  left: 12%;
  right: 12%;
  height: 2px;
  background: linear-gradient(90deg, var(--gold-500), var(--teal-500));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.6s var(--ease) 0.3s;
}

.steps.visible::before {
  transform: scaleX(1);
}

.step {
  position: relative;
  text-align: center;
  padding: 0 8px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
  transition-delay: calc(var(--i) * 0.25s + 0.2s);
}

.steps.visible .step {
  opacity: 1;
  transform: none;
}

.step-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: var(--surface);
  color: var(--indigo-700);
  border: 2px solid var(--indigo-100);
  box-shadow: var(--shadow);
  transition: transform 0.4s var(--ease), background 0.4s, color 0.4s;
}

.step:hover .step-icon {
  transform: translateY(-6px) scale(1.06);
  background: var(--indigo-700);
  color: #fff;
}

.step-num {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-600);
}

.step h3 {
  margin-top: 6px;
  font-size: 1.25rem;
  color: var(--indigo-900);
}

.step p {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.97rem;
}

@media (max-width: 860px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr 1fr;
    row-gap: 40px;
  }

  .steps::before {
    display: none;
  }
}

@media (max-width: 480px) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
