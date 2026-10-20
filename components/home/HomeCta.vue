<script setup lang="ts">
const { site } = useAppConfig()

const contacts = computed(() => [
  { icon: 'map-pin', label: 'Visítanos', value: site.address, href: site.mapsUrl, external: true },
  { icon: 'mail', label: 'Escríbenos', value: site.email, href: `mailto:${site.email}` },
  { icon: 'phone', label: 'Llámanos', value: `${site.phone} · ${site.phoneAlt}`, href: site.phoneHref }
])
</script>

<template>
  <section class="section cta-section">
    <div class="container">
      <div v-reveal="{ from: 'zoom' }" class="cta">
        <svg class="ecg" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 100 H380 L410 60 L440 150 L470 20 L500 180 L530 100 H760 L780 80 L800 120 L820 100 H1200" />
        </svg>

        <div class="cta-copy">
          <span class="eyebrow light">Hablemos</span>
          <h2>¿Listo para equipar tu centro de salud?</h2>
          <p>Cuéntanos qué necesitas y te enviamos una cotización personalizada a la brevedad.</p>
        </div>
        <div class="cta-actions">
          <a :href="site.whatsapp" target="_blank" rel="noopener" class="btn">
            <AppIcon name="whatsapp" :size="20" /> Escríbenos por WhatsApp
          </a>
          <NuxtLink to="/contacto" class="btn btn-ghost">
            Formulario de contacto <AppIcon name="arrow-right" :size="18" />
          </NuxtLink>
        </div>
      </div>

      <div class="contacts">
        <a
          v-for="(c, i) in contacts"
          :key="c.label"
          v-reveal="{ delay: i * 120 }"
          :href="c.href"
          :target="c.external ? '_blank' : undefined"
          :rel="c.external ? 'noopener' : undefined"
          class="contact"
        >
          <span class="c-icon"><AppIcon :name="c.icon" :size="22" /></span>
          <span>
            <small>{{ c.label }}</small>
            <strong>{{ c.value }}</strong>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding-top: 0;
  background: linear-gradient(var(--surface) 50%, var(--bg) 50%);
}

.cta {
  position: relative;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  align-items: center;
  gap: 40px;
  padding: clamp(40px, 6vw, 72px);
  border-radius: 32px;
  color: #fff;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(70% 120% at 100% 0%, rgba(47, 208, 212, 0.35), transparent 60%),
    radial-gradient(60% 100% at 0% 100%, rgba(201, 161, 59, 0.3), transparent 60%),
    linear-gradient(135deg, var(--indigo-700), var(--indigo-950));
  box-shadow: var(--shadow-lg);
}

.ecg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.25;
}

.ecg path {
  fill: none;
  stroke: var(--teal-300);
  stroke-width: 3;
  stroke-dasharray: 1600;
  stroke-dashoffset: 1600;
  animation: draw 5s linear infinite;
}

@keyframes draw {
  60% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -1600; }
}

.eyebrow.light {
  color: var(--gold-300);
}

h2 {
  margin-top: 12px;
  font-size: clamp(1.9rem, 3.6vw, 2.8rem);
  font-weight: 700;
}

.cta-copy p {
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.08rem;
}

.cta-actions {
  display: grid;
  gap: 14px;
  justify-items: stretch;
}

.contacts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.contact {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.contact:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.c-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
  transition: transform 0.5s var(--ease);
}

.contact:hover .c-icon {
  transform: rotate(-8deg) scale(1.08);
}

.contact small {
  display: block;
  color: var(--muted);
  font-size: 0.85rem;
}

.contact strong {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--indigo-900);
  font-size: 0.98rem;
  word-break: break-word;
}

@media (max-width: 900px) {
  .cta {
    grid-template-columns: 1fr;
  }

  .contacts {
    grid-template-columns: 1fr;
  }
}
</style>
