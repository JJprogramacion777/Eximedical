<script setup lang="ts">
const items = [
  {
    icon: 'target',
    title: 'Misión',
    text: 'Ofrecer equipos médicos de última generación con altos estándares de calidad, asegurando innovación, confiabilidad y excelencia en cada uno de nuestros productos y servicios. Nos dedicamos a atender las necesidades del sector salud, proporcionando soluciones efectivas que favorezcan el bienestar de los pacientes y el avance tecnológico en el campo médico.'
  },
  {
    icon: 'eye',
    title: 'Visión',
    text: 'Ser la empresa líder en la importación y distribución de equipos médicos en el país, ampliando nuestra presencia y consolidando la confianza de nuestros clientes mediante tecnología avanzada, un servicio excepcional y una red de distribución eficiente. Aspiramos a ser un socio estratégico en el sector salud, promoviendo la modernización y la accesibilidad de equipos médicos en el mercado.'
  }
]
</script>

<template>
  <section class="section mv">
    <div class="container">
      <div class="section-head center">
        <span v-reveal class="eyebrow">Nuestro propósito</span>
        <h2 v-reveal="{ delay: 100 }" class="section-title">Lo que nos <em>impulsa</em> cada día</h2>
      </div>

      <div class="cards">
        <article
          v-for="(item, i) in items"
          :key="item.title"
          v-reveal="{ delay: i * 150, from: i === 0 ? 'left' : 'right' }"
          class="card"
        >
          <span class="num">0{{ i + 1 }}</span>
          <span class="icon-wrap"><AppIcon :name="item.icon" :size="34" /></span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mv {
  background:
    radial-gradient(50% 60% at 0% 0%, rgba(47, 208, 212, 0.16), transparent 70%),
    radial-gradient(50% 60% at 100% 100%, rgba(201, 161, 59, 0.16), transparent 70%),
    var(--indigo-950);
  color: #fff;
}

.mv .section-title {
  color: #fff;
}

.mv .section-title em {
  background: linear-gradient(90deg, var(--gold-300), var(--teal-300));
  -webkit-background-clip: text;
  background-clip: text;
}

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

/* Borde con degradado que gira al pasar el mouse */
.card {
  --angle: 0deg;
  position: relative;
  padding: clamp(32px, 4vw, 48px);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.5s var(--ease), background 0.5s;
}

.card::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -2;
  border-radius: inherit;
  background: conic-gradient(from var(--angle), var(--gold-500), var(--teal-500), var(--indigo-500), var(--gold-500));
  opacity: 0;
  transition: opacity 0.5s;
  animation: rotate 4s linear infinite;
}

.card::after {
  content: '';
  position: absolute;
  inset: 2px;
  z-index: -1;
  border-radius: 26px;
  background: var(--indigo-950);
  opacity: 0;
  transition: opacity 0.5s;
}

.card:hover {
  transform: translateY(-8px);
}

.card:hover::before,
.card:hover::after {
  opacity: 1;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate {
  to { --angle: 360deg; }
}

.num {
  position: absolute;
  top: 18px;
  right: 28px;
  font-family: var(--font-display);
  font-size: 5.5rem;
  font-weight: 800;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.14);
  transition: -webkit-text-stroke-color 0.5s;
}

.card:hover .num {
  -webkit-text-stroke-color: rgba(230, 200, 110, 0.5);
}

.icon-wrap {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
  box-shadow: 0 16px 40px -12px rgba(201, 161, 59, 0.8);
  transition: transform 0.6s var(--ease);
}

.card:nth-child(2) .icon-wrap {
  background: linear-gradient(135deg, var(--teal-300), var(--teal-500));
  box-shadow: 0 16px 40px -12px rgba(47, 208, 212, 0.8);
}

.card:hover .icon-wrap {
  transform: rotate(-10deg) scale(1.08);
}

h3 {
  margin-top: 28px;
  font-size: 2rem;
}

p {
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.05rem;
  line-height: 1.75;
}

@media (max-width: 860px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
