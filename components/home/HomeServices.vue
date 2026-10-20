<script setup lang="ts">
const services = [
  {
    icon: 'package',
    title: 'Equipos médicos y hospitalarios',
    text: 'Garantizamos tecnología avanzada y soluciones confiables para el sector salud, suministrando equipos médicos y hospitalarios de alta calidad.',
    img: '/images/srv-equipos.png'
  },
  {
    icon: 'wrench',
    title: 'Servicio técnico',
    text: 'Ofrecemos ayuda técnica dirigida, asegurando que los dispositivos médicos funcionen bien y se mantengan en buena forma con atención especializada y eficiente.',
    img: '/images/srv-tecnico.png'
  },
  {
    icon: 'headset',
    title: 'Asesoramiento y demostración',
    text: 'Te acompañamos con orientación profesional y demostraciones prácticas para que elijas el equipo correcto y tu personal lo aproveche al máximo.',
    img: '/images/srv-demo.png'
  }
]

// Las pestañas rotan solas; se detienen mientras el usuario interactúa
const DURATION = 6000
const active = ref(0)
const paused = ref(false)
const cycle = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const select = (i: number) => {
  active.value = i
  cycle.value++
}

onMounted(() => {
  timer = setInterval(() => {
    if (!paused.value) select((active.value + 1) % services.length)
  }, DURATION)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <section class="section services" @pointerenter="paused = true" @pointerleave="paused = false">
    <div class="container inner">
      <div>
        <span v-reveal class="eyebrow">Servicios</span>
        <h2 v-reveal="{ delay: 100 }" class="section-title">Más que vender, <em>te acompañamos</em></h2>
        <p v-reveal="{ delay: 200 }" class="section-lead">
          Desde la elección del equipo hasta su mantenimiento, estamos contigo en cada etapa.
        </p>

        <div class="tabs" role="tablist">
          <button
            v-for="(s, i) in services"
            :key="s.title"
            v-reveal="{ delay: 250 + i * 100, from: 'left' }"
            class="tab"
            :class="{ active: active === i }"
            role="tab"
            :aria-selected="active === i"
            @click="select(i)"
          >
            <span class="tab-icon"><AppIcon :name="s.icon" :size="22" /></span>
            <span class="tab-body">
              <strong>{{ s.title }}</strong>
              <span class="tab-text">{{ s.text }}</span>
            </span>
            <span
              v-if="active === i"
              :key="cycle"
              class="bar"
              :class="{ paused }"
              :style="{ animationDuration: `${DURATION}ms` }"
            />
          </button>
        </div>
      </div>

      <div v-reveal="{ from: 'zoom', delay: 200 }" class="stage">
        <div class="halo" />
        <div class="orbit"><span /><span /><span /></div>
        <img
          v-for="(s, i) in services"
          :key="s.img"
          :src="s.img"
          :alt="active === i ? s.title : ''"
          :class="{ current: active === i }"
          width="300"
          height="300"
        >
        <div class="stage-label">
          <span>0{{ active + 1 }}</span> / 0{{ services.length }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  background:
    radial-gradient(60% 60% at 90% 10%, rgba(47, 208, 212, 0.18), transparent 70%),
    radial-gradient(50% 50% at 0% 100%, rgba(201, 161, 59, 0.16), transparent 70%),
    var(--indigo-950);
  color: #fff;
  overflow: hidden;
}

.services .section-title {
  color: #fff;
}

.services .section-title em {
  background: linear-gradient(90deg, var(--gold-300), var(--teal-300));
  -webkit-background-clip: text;
  background-clip: text;
}

.services .section-lead {
  color: rgba(255, 255, 255, 0.7);
}

.inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 64px;
  align-items: center;
}

.tabs {
  display: grid;
  gap: 14px;
  margin-top: 40px;
}

.tab {
  position: relative;
  display: flex;
  gap: 18px;
  text-align: left;
  padding: 20px 22px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  overflow: hidden;
  transition: background 0.4s var(--ease), border-color 0.4s;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.06);
}

.tab.active {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(230, 200, 110, 0.5);
}

.tab-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--teal-300);
  transition: background 0.4s, color 0.4s;
}

.tab.active .tab-icon {
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
}

.tab-body strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
}

/* El texto solo se despliega en la pestaña activa */
.tab-text {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.97rem;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.6s var(--ease), margin 0.5s var(--ease);
}

.tab.active .tab-text {
  max-height: 200px;
  margin-top: 6px;
}

.bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--gold-500), var(--teal-500));
  transform-origin: left;
  animation: fill linear forwards;
}

.bar.paused {
  animation-play-state: paused;
}

@keyframes fill {
  from { transform: scaleX(0); }
}

/* Escenario con la imagen */
.stage {
  position: relative;
  aspect-ratio: 1;
  max-width: 460px;
  width: 100%;
  justify-self: center;
  display: grid;
  place-items: center;
}

.halo {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--teal-500), var(--indigo-500), var(--gold-500), var(--teal-500));
  filter: blur(40px);
  opacity: 0.45;
  animation: spin 14s linear infinite;
}

.orbit {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  animation: spin 24s linear infinite;
}

.orbit span {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--gold-300);
  box-shadow: 0 0 20px var(--gold-300);
}

.orbit span:nth-child(1) { top: -7px; left: calc(50% - 7px); }
.orbit span:nth-child(2) { bottom: 14%; left: 4%; background: var(--teal-300); box-shadow: 0 0 20px var(--teal-300); }
.orbit span:nth-child(3) { bottom: 14%; right: 4%; width: 8px; height: 8px; }

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Las tres imágenes se apilan y solo la activa es visible */
.stage img {
  position: relative;
  grid-area: 1 / 1;
  width: 78%;
  height: auto;
  filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.45));
  opacity: 0;
  transform: scale(0.85) rotate(-8deg);
  transition: opacity 0.6s var(--ease), transform 0.8s var(--ease);
}

.stage img.current {
  opacity: 1;
  transform: none;
}

.halo,
.orbit {
  grid-area: 1 / 1;
}

.stage-label {
  position: absolute;
  right: 4%;
  top: 6%;
  font-family: var(--font-display);
  color: rgba(255, 255, 255, 0.6);
}

.stage-label span {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
}

@media (max-width: 960px) {
  .inner {
    grid-template-columns: 1fr;
  }

  .stage {
    max-width: 360px;
    order: -1;
  }
}
</style>
