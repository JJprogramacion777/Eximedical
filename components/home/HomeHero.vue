<script setup lang="ts">
const { site } = useAppConfig()

// Palabra que se escribe y borra sola en el titular
const words = ['equipos médicos', 'mobiliario clínico', 'instrumental', 'insumos médicos', 'modelos anatómicos']
const typed = ref(words[0])
let timer: ReturnType<typeof setTimeout> | undefined

const type = (wi: number, ci: number, deleting: boolean) => {
  const word = words[wi]!
  typed.value = word.slice(0, ci)
  if (!deleting && ci === word.length) {
    timer = setTimeout(() => type(wi, ci, true), 1800)
  }
  else if (deleting && ci === 0) {
    timer = setTimeout(() => type((wi + 1) % words.length, 0, false), 300)
  }
  else {
    timer = setTimeout(() => type(wi, ci + (deleting ? -1 : 1), deleting), deleting ? 35 : 70)
  }
}

// Paralaje suave de la composición según la posición del mouse
const visual = ref<HTMLElement>()
const tilt = reactive({ x: 0, y: 0 })
const onMove = (e: PointerEvent) => {
  if (!visual.value || e.pointerType !== 'mouse') return
  const r = visual.value.getBoundingClientRect()
  tilt.x = ((e.clientX - r.left) / r.width - 0.5) * 2
  tilt.y = ((e.clientY - r.top) / r.height - 0.5) * 2
}
const resetTilt = () => Object.assign(tilt, { x: 0, y: 0 })

onMounted(() => {
  timer = setTimeout(() => type(0, words[0]!.length, true), 2200)
})
onBeforeUnmount(() => clearTimeout(timer))

const highlights = ['Marcas reconocidas', 'Servicio técnico', 'Asesoría y demostración']
</script>

<template>
  <section class="hero" @pointermove="onMove" @pointerleave="resetTilt">
    <div class="bg" aria-hidden="true">
      <span class="blob b1" />
      <span class="blob b2" />
      <span class="blob b3" />
      <span class="grid" />
      <span v-for="n in 8" :key="n" class="cross" :style="{ '--n': n }">+</span>
    </div>

    <div class="container hero-inner">
      <div class="copy">
        <span class="pill">
          <span class="dot" /> Importadores directos · Quito, Ecuador
        </span>

        <h1>
          Equipamos la salud con
          <span class="typed"><span>{{ typed }}</span><i class="caret" /></span>
          de alta calidad.
        </h1>

        <p class="lead">
          Importamos y distribuimos tecnología médica confiable para hospitales, clínicas y consultorios,
          con asesoría experta y servicio técnico especializado.
        </p>

        <div class="ctas">
          <NuxtLink to="/catalogo" class="btn">
            Ver catálogo <AppIcon name="arrow-right" :size="18" />
          </NuxtLink>
          <a :href="site.whatsapp" target="_blank" rel="noopener" class="btn btn-ghost">
            <AppIcon name="whatsapp" :size="20" /> Solicitar cotización
          </a>
        </div>

        <ul class="highlights">
          <li v-for="h in highlights" :key="h"><AppIcon name="check" :size="16" /> {{ h }}</li>
        </ul>
      </div>

      <div
        ref="visual"
        class="visual"
        :style="{ '--tx': tilt.x, '--ty': tilt.y }"
      >
        <div class="ring" />
        <div class="photo">
          <img src="/images/hero.jpg" alt="Médico sosteniendo un estetoscopio" width="1024" height="576">
        </div>

        <div class="float-card ecg">
          <div class="card-icon gold"><AppIcon name="shield-check" :size="20" /></div>
          <div>
            <strong>Tecnología confiable</strong>
            <svg viewBox="0 0 160 36" class="ecg-line" aria-hidden="true">
              <path d="M0 18 H40 L48 6 L56 30 L64 2 L72 34 L80 18 H160" />
            </svg>
          </div>
        </div>

        <div class="float-card brands">
          <div class="avatars">
            <img src="/images/brands/riester.jpg" alt="">
            <img src="/images/brands/beurer.jpg" alt="">
            <img src="/images/brands/yuwel.jpg" alt="">
          </div>
          <div>
            <strong>+10 marcas</strong>
            <small>aliadas internacionales</small>
          </div>
        </div>

        <div class="float-card tech">
          <div class="card-icon teal"><AppIcon name="wrench" :size="20" /></div>
          <div>
            <strong>Servicio técnico</strong>
            <small>especializado y eficiente</small>
          </div>
        </div>
      </div>
    </div>

    <a href="#categorias" class="scroll-hint" aria-label="Desplazarse a categorías">
      <span />
    </a>

    <svg class="wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 50 C 240 100 480 0 720 40 S 1200 90 1440 30 V90 H0 Z" />
    </svg>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: calc(var(--header-h) + 80px) 0 140px;
  color: #fff;
  background: radial-gradient(120% 120% at 10% 10%, var(--indigo-700) 0%, var(--indigo-900) 45%, var(--indigo-950) 100%);
  overflow: hidden;
  isolation: isolate;
}

/* ---- Fondo animado ---- */
.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  animation: drift 18s ease-in-out infinite alternate;
}

.b1 {
  width: 520px;
  height: 520px;
  background: var(--indigo-500);
  top: -160px;
  left: -120px;
}

.b2 {
  width: 420px;
  height: 420px;
  background: var(--teal-500);
  bottom: -120px;
  right: 10%;
  opacity: 0.35;
  animation-delay: -6s;
}

.b3 {
  width: 300px;
  height: 300px;
  background: var(--gold-500);
  top: 20%;
  right: -80px;
  opacity: 0.3;
  animation-delay: -12s;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%);
}

.cross {
  position: absolute;
  font-family: var(--font-display);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.18);
  font-size: calc(14px + var(--n) * 3px);
  left: calc(var(--n) * 11% + 2%);
  top: calc(100% + 20px);
  animation: rise calc(14s + var(--n) * 2s) linear infinite;
  animation-delay: calc(var(--n) * -2.3s);
}

@keyframes drift {
  to {
    transform: translate(60px, 40px) scale(1.15);
  }
}

@keyframes rise {
  to {
    transform: translateY(calc(-100vh - 200px)) rotate(180deg);
  }
}

/* ---- Contenido ---- */
.hero-inner {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 48px;
}

.copy > * {
  animation: fade-up 1s var(--ease) both;
}

.copy > :nth-child(2) { animation-delay: 0.1s; }
.copy > :nth-child(3) { animation-delay: 0.2s; }
.copy > :nth-child(4) { animation-delay: 0.3s; }
.copy > :nth-child(5) { animation-delay: 0.4s; }

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--teal-500);
  box-shadow: 0 0 0 0 rgba(47, 208, 212, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  70% { box-shadow: 0 0 0 10px rgba(47, 208, 212, 0); }
  100% { box-shadow: 0 0 0 0 rgba(47, 208, 212, 0); }
}

h1 {
  margin-top: 24px;
  font-size: clamp(2.5rem, 5.6vw, 4.4rem);
  font-weight: 700;
  line-height: 1.05;
}

.typed {
  display: block;
  min-height: 1.1em;
  white-space: nowrap;
  background: linear-gradient(90deg, var(--gold-300), var(--gold-500) 40%, var(--teal-300));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.caret {
  display: inline-block;
  width: 4px;
  height: 0.85em;
  margin-left: 6px;
  vertical-align: -0.05em;
  background: var(--gold-300);
  border-radius: 2px;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.lead {
  margin-top: 24px;
  font-size: 1.12rem;
  color: rgba(255, 255, 255, 0.78);
  max-width: 540px;
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.highlights {
  list-style: none;
  padding: 0;
  margin: 36px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

.highlights li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.highlights .icon {
  color: var(--indigo-950);
  background: var(--teal-500);
  border-radius: 50%;
  padding: 3px;
  width: 20px;
  height: 20px;
}

/* ---- Composición visual ---- */
.visual {
  --tx: 0;
  --ty: 0;
  position: relative;
  aspect-ratio: 1;
  max-width: 540px;
  justify-self: center;
  width: 100%;
  animation: fade-in 1.2s var(--ease) 0.3s both;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
}

.ring {
  position: absolute;
  inset: -4%;
  border-radius: 50%;
  border: 2px dashed rgba(230, 200, 110, 0.4);
  animation: spin 40s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.photo {
  position: absolute;
  inset: 6%;
  border-radius: 46% 54% 42% 58% / 52% 44% 56% 48%;
  overflow: hidden;
  box-shadow: var(--shadow-lg), 0 0 0 10px rgba(255, 255, 255, 0.06);
  animation: morph 12s ease-in-out infinite alternate;
  transform: translate(calc(var(--tx) * -8px), calc(var(--ty) * -8px));
  transition: transform 0.6s var(--ease);
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 62% center;
  transform: scale(1.12);
}

@keyframes morph {
  to { border-radius: 58% 42% 55% 45% / 45% 58% 42% 55%; }
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--ink);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(12px);
  transition: transform 0.6s var(--ease);
  animation: bob 6s ease-in-out infinite;
}

.float-card strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--indigo-900);
}

.float-card small {
  color: var(--muted);
  font-size: 0.82rem;
}

.ecg {
  top: 8%;
  left: -6%;
  translate: calc(var(--tx) * 18px) calc(var(--ty) * 18px);
}

.brands {
  bottom: 14%;
  left: -10%;
  translate: calc(var(--tx) * 26px) calc(var(--ty) * 26px);
  animation-delay: -2s;
}

.tech {
  top: 46%;
  right: -8%;
  translate: calc(var(--tx) * 14px) calc(var(--ty) * 14px);
  animation-delay: -4s;
}

@keyframes bob {
  50% { transform: translateY(-12px); }
}

.card-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  flex-shrink: 0;
}

.card-icon.gold {
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
}

.card-icon.teal {
  background: linear-gradient(135deg, var(--teal-300), var(--teal-500));
  color: var(--indigo-950);
}

.ecg-line {
  width: 140px;
  height: 28px;
  margin-top: 2px;
}

.ecg-line path {
  fill: none;
  stroke: #e04848;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  animation: ecg 2.4s linear infinite;
}

@keyframes ecg {
  60% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -260; }
}

.avatars {
  display: flex;
}

.avatars img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: contain;
  padding: 3px;
  border: 2px solid var(--indigo-100);
  margin-left: -10px;
  background: #fff;
}

.avatars img:first-child {
  margin-left: 0;
}

/* ---- Indicador de scroll y onda ---- */
.scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 96px;
  translate: -50% 0;
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 14px;
}

.scroll-hint span {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: #fff;
  animation: scroll-dot 1.8s var(--ease) infinite;
}

@keyframes scroll-dot {
  to {
    transform: translateY(14px);
    opacity: 0;
  }
}

.wave {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 90px;
}

.wave path {
  fill: var(--gold-500);
}

@media (max-width: 960px) {
  .hero {
    padding-top: calc(var(--header-h) + 72px);
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 72px;
  }

  .visual {
    max-width: 420px;
  }

  .scroll-hint {
    display: none;
  }
}

@media (max-width: 560px) {
  h1 {
    font-size: clamp(2rem, 9vw, 2.5rem);
  }

  .ecg { left: -2%; }
  .brands { left: -2%; }
  .tech { right: -2%; }

  .float-card {
    padding: 10px 12px;
  }

  .float-card strong {
    font-size: 0.9rem;
  }
}
</style>
