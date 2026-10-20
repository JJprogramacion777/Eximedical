<script setup lang="ts">
const highlights = [
  { icon: 'users', text: 'Equipo de expertos capacitados' },
  { icon: 'headset', text: 'Asesoramiento técnico personalizado' },
  { icon: 'zap', text: 'Eficiencia y transparencia' },
  { icon: 'heart', text: 'Compromiso con la salud' }
]
</script>

<template>
  <section class="section intro">
    <div class="container inner">
      <div v-reveal="{ from: 'left' }" class="media">
        <div class="frame" />
        <div class="photo">
          <img src="/images/equipo-eximedical.jpg" alt="Equipo de Eximedical en sus oficinas" width="1024" height="768">
        </div>
        <div class="badge b-team">
          <span class="b-icon"><AppIcon name="users" :size="22" /></span>
          <span><strong>Nuestro equipo</strong><small>Expertos a tu servicio</small></span>
        </div>
        <div class="badge b-country">
          <span class="b-icon teal"><AppIcon name="globe" :size="22" /></span>
          <span><strong>Todo el país</strong><small>Hospitales, clínicas y consultorios</small></span>
        </div>
      </div>

      <div class="copy">
        <span v-reveal class="eyebrow">¿Quiénes somos?</span>
        <h2 v-reveal="{ delay: 100 }" class="section-title">Tecnología médica con <em>respaldo humano</em></h2>
        <p v-reveal="{ delay: 200 }" class="text">
          En <strong>Eximedical</strong> nos dedicamos a la importación y distribución de equipos médicos de última
          tecnología, proporcionando soluciones innovadoras y de alta calidad a hospitales, clínicas y profesionales de
          la salud en todo el país.
        </p>
        <p v-reveal="{ delay: 260 }" class="text">
          Nuestro equipo está formado por expertos capacitados, comprometidos a ofrecer asesoramiento técnico y un
          servicio excepcional. Gracias a nuestra fuerte presencia en redes sociales y Google, nos hemos establecido
          como una empresa confiable y de referencia en el sector.
        </p>

        <ul class="highlights">
          <li v-for="(h, i) in highlights" :key="h.text" v-reveal="{ delay: 320 + i * 80 }">
            <span class="h-icon"><AppIcon :name="h.icon" :size="18" /></span>
            {{ h.text }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(48px, 7vw, 96px);
  align-items: center;
}

/* ---- Foto ---- */
.media {
  position: relative;
  padding: 0 24px 24px 0;
}

.frame {
  position: absolute;
  inset: 24px 0 0 24px;
  border-radius: 28px;
  border: 2px solid var(--gold-500);
  background:
    repeating-linear-gradient(45deg, rgba(201, 161, 59, 0.12) 0 2px, transparent 2px 12px);
}

.photo {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  aspect-ratio: 4 / 3;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease);
}

.media:hover .photo img {
  transform: scale(1.05);
}

/* Cortina que descubre la foto al aparecer */
.photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--indigo-700), var(--teal-500));
  transform-origin: right;
  transition: transform 1.1s var(--ease) 0.3s;
}

.media.is-visible .photo::after {
  transform: scaleX(0);
}

.badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(10px);
  animation: bob 6s ease-in-out infinite;
}

.badge strong {
  display: block;
  font-family: var(--font-display);
  color: var(--indigo-900);
}

.badge small {
  color: var(--muted);
  font-size: 0.82rem;
}

.b-team {
  top: 8%;
  left: -32px;
}

.b-country {
  bottom: 0;
  right: -12px;
  animation-delay: -3s;
}

.b-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
}

.b-icon.teal {
  background: linear-gradient(135deg, var(--teal-300), var(--teal-500));
}

@keyframes bob {
  50% { transform: translateY(-10px); }
}

/* ---- Texto ---- */
.text {
  margin-top: 18px;
  color: var(--muted);
  font-size: 1.05rem;
}

.text strong {
  color: var(--indigo-800);
}

.highlights {
  list-style: none;
  padding: 0;
  margin: 32px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.highlights li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--line);
  font-weight: 500;
  color: var(--indigo-900);
  font-size: 0.95rem;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.3s;
}

.highlights li:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: rgba(47, 208, 212, 0.5);
}

.h-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--indigo-100);
  color: var(--indigo-700);
}

@media (max-width: 960px) {
  .inner {
    grid-template-columns: 1fr;
  }

  .b-team {
    left: -8px;
  }
}

@media (max-width: 560px) {
  .highlights {
    grid-template-columns: 1fr;
  }

  .badge {
    padding: 10px 12px;
  }

  .badge small {
    display: none;
  }
}
</style>
