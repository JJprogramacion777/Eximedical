<script setup lang="ts">
// Valores tomados de la misión y visión de la empresa
const values = [
  { icon: 'lightbulb', title: 'Innovación', text: 'Traemos tecnología médica de última generación al país.' },
  { icon: 'award', title: 'Calidad', text: 'Trabajamos solo con productos de altos estándares y marcas reconocidas.' },
  { icon: 'shield-check', title: 'Confiabilidad', text: 'Equipos que responden cuando más se necesitan.' },
  { icon: 'eye', title: 'Transparencia', text: 'Información clara y honesta en cada cotización y entrega.' },
  { icon: 'zap', title: 'Eficiencia', text: 'Procesos ágiles y una red de distribución eficiente.' },
  { icon: 'heart', title: 'Compromiso con la salud', text: 'Cada solución busca el bienestar de los pacientes.' }
]
</script>

<template>
  <section class="section values">
    <div class="container">
      <div class="section-head center">
        <span v-reveal class="eyebrow">Nuestros valores</span>
        <h2 v-reveal="{ delay: 100 }" class="section-title">Los principios que nos <em>definen</em></h2>
        <p v-reveal="{ delay: 200 }" class="section-lead">
          Son la base de cada producto que importamos y de cada cliente que atendemos.
        </p>
      </div>

      <div class="grid">
        <article v-for="(v, i) in values" :key="v.title" v-reveal="{ delay: (i % 3) * 110 }" class="value">
          <span class="v-icon"><AppIcon :name="v.icon" :size="26" /></span>
          <h3>{{ v.title }}</h3>
          <p>{{ v.text }}</p>
        </article>
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

.value {
  position: relative;
  padding: 32px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease), color 0.4s;
}

/* Relleno de color que sube desde abajo al pasar el mouse */
.value::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(160deg, var(--indigo-700), var(--indigo-950));
  transform: translateY(101%);
  transition: transform 0.55s var(--ease);
}

.value:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.value:hover::before {
  transform: none;
}

.v-icon {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: var(--indigo-100);
  color: var(--indigo-700);
  transition: background 0.4s, color 0.4s, transform 0.6s var(--ease);
}

.value:hover .v-icon {
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
  transform: rotate(-10deg) scale(1.08);
}

h3 {
  margin-top: 22px;
  font-size: 1.35rem;
  color: var(--indigo-900);
  transition: color 0.4s;
}

p {
  margin-top: 10px;
  color: var(--muted);
  transition: color 0.4s;
}

.value:hover h3 {
  color: #fff;
}

.value:hover p {
  color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
