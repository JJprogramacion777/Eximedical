<script setup lang="ts">
const { site } = useAppConfig()

const cards = computed(() => [
  {
    icon: 'map-pin',
    title: 'Oficina',
    text: 'Visítanos en nuestra ubicación para atenderte personalmente y resolver tus inquietudes.',
    value: site.address,
    href: site.mapsUrl,
    external: true
  },
  {
    icon: 'phone',
    title: 'Teléfono',
    text: 'No dudes en llamarnos si necesitas asistencia inmediata con tus importaciones médicas.',
    value: `${site.phone} · ${site.phoneAlt}`,
    href: site.phoneHref
  },
  {
    icon: 'mail',
    title: 'Correo electrónico',
    text: 'Estamos aquí para responder tus dudas. Escríbenos para más información.',
    value: site.email,
    href: `mailto:${site.email}`
  }
])
</script>

<template>
  <section class="section info">
    <div class="container grid">
      <a
        v-for="(c, i) in cards"
        :key="c.title"
        v-reveal="{ delay: i * 120 }"
        :href="c.href"
        :target="c.external ? '_blank' : undefined"
        :rel="c.external ? 'noopener' : undefined"
        class="card"
      >
        <span class="icon-wrap"><AppIcon :name="c.icon" :size="28" /></span>
        <h3>{{ c.title }}</h3>
        <p>{{ c.text }}</p>
        <strong>{{ c.value }}</strong>
        <span class="arrow"><AppIcon name="arrow-right" :size="18" /></span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.info {
  padding-bottom: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 34px 30px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
}

.card::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--gold-500), var(--teal-500));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow);
}

.card:hover::after {
  transform: scaleX(1);
}

.icon-wrap {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--indigo-500), var(--indigo-800));
  color: #fff;
  box-shadow: 0 14px 30px -12px rgba(47, 36, 144, 0.8);
  transition: transform 0.6s var(--ease), background 0.4s;
}

.card:hover .icon-wrap {
  transform: rotate(-10deg) scale(1.08);
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
}

h3 {
  margin-top: 22px;
  font-size: 1.35rem;
  color: var(--indigo-900);
}

p {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.97rem;
  flex: 1;
}

strong {
  margin-top: 16px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--indigo-700);
  padding-right: 40px;
}

.arrow {
  position: absolute;
  right: 26px;
  bottom: 30px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--indigo-100);
  color: var(--indigo-700);
  transition: transform 0.4s var(--ease), background 0.3s;
}

.card:hover .arrow {
  transform: rotate(-45deg);
  background: var(--gold-500);
  color: var(--indigo-950);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
