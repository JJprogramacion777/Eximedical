<script setup lang="ts">
const { site } = useAppConfig()
const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent('Alonso de Angulo Oe2-763 y Galo Molina, Quito, Ecuador')}&z=16&output=embed`
</script>

<template>
  <section class="section main">
    <div class="container grid">
      <div v-reveal="{ from: 'left' }">
        <ContactForm />
      </div>

      <aside class="side">
        <div v-reveal="{ from: 'right' }" class="map">
          <iframe
            :src="mapSrc"
            title="Ubicación de Eximedical en Quito"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
          <a :href="site.mapsUrl" target="_blank" rel="noopener" class="map-btn">
            <AppIcon name="map-pin" :size="16" /> Cómo llegar
          </a>
        </div>

        <div v-reveal="{ from: 'right', delay: 150 }" class="quick">
          <span class="eyebrow light">¿Prefieres hablar ya?</span>
          <h3>Atención inmediata por WhatsApp</h3>
          <p>Escríbenos y te ayudamos a elegir el equipo ideal o a cotizar tu pedido.</p>
          <a :href="site.whatsapp" target="_blank" rel="noopener" class="btn">
            <AppIcon name="whatsapp" :size="20" /> Abrir WhatsApp
          </a>
          <div class="socials">
            <span>Síguenos</span>
            <a
              v-for="s in site.socials"
              :key="s.name"
              :href="s.url"
              :aria-label="s.name"
              target="_blank"
              rel="noopener"
            ><AppIcon :name="s.icon" :size="18" /></a>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 32px;
  align-items: start;
}

.side {
  display: grid;
  gap: 24px;
  position: sticky;
  top: calc(var(--header-h) + 24px);
}

.map {
  position: relative;
  height: 320px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
}

.map iframe {
  width: 100%;
  height: 100%;
  border: 0;
  filter: saturate(0.9);
}

.map-btn {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--indigo-700);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: var(--shadow);
  transition: transform 0.3s var(--ease);
}

.map-btn:hover {
  transform: translateY(-3px);
}

.quick {
  position: relative;
  padding: 34px;
  border-radius: 28px;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(80% 100% at 100% 0%, rgba(47, 208, 212, 0.35), transparent 60%),
    linear-gradient(140deg, var(--indigo-700), var(--indigo-950));
  box-shadow: var(--shadow-lg);
}

.eyebrow.light {
  color: var(--gold-300);
}

.quick h3 {
  margin-top: 12px;
  font-size: 1.6rem;
}

.quick p {
  margin: 10px 0 22px;
  color: rgba(255, 255, 255, 0.78);
}

.socials {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.socials span {
  margin-right: auto;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.socials a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.3s, color 0.3s, transform 0.3s var(--ease);
}

.socials a:hover {
  background: var(--gold-500);
  color: var(--indigo-950);
  transform: translateY(-3px);
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .side {
    position: static;
  }
}
</style>
