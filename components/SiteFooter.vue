<script setup lang="ts">
const { site, nav } = useAppConfig()
const year = new Date().getFullYear()
const mainLinks = nav.filter(n => !n.children)
const shopLinks = nav.find(n => n.children)?.children ?? []
</script>

<template>
  <footer class="footer">
    <div class="container cols">
      <div class="about">
        <img src="/images/logo-light.png"alt="Eximedical" width="600" height="218" class="logo">
        <p>
          Importación y distribución de equipos médicos, mobiliario hospitalario e insumos de alta calidad para el
          sector salud del Ecuador.
        </p>
        <div class="socials">
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

      <div>
        <h4>Menú</h4>
        <ul>
          <li v-for="l in mainLinks" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4>Tienda</h4>
        <ul>
          <li v-for="l in shopLinks" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4>Contacto</h4>
        <ul class="contact">
          <li><AppIcon name="map-pin" :size="18" /> <span>{{ site.address }}</span></li>
          <li><AppIcon name="mail" :size="18" /> <a :href="`mailto:${site.email}`">{{ site.email }}</a></li>
          <li><AppIcon name="phone" :size="18" /> <a :href="site.phoneHref">{{ site.phone }}</a></li>
        </ul>
      </div>
    </div>

    <div class="bottom">
      <div class="container bottom-inner">
        <span>© {{ year }} {{ site.name }} · {{ site.tagline }}</span>
        <span>Quito, Ecuador</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: var(--indigo-950);
  color: rgba(255, 255, 255, 0.72);
  padding-top: 80px;
}

.footer::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: linear-gradient(90deg, var(--gold-500), var(--teal-500), var(--indigo-500));
}

.cols {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1fr 1.3fr;
  gap: 40px;
  padding-bottom: 56px;
}

.logo {
  width: 200px;
  height: auto;
}

.about p {
  margin-top: 18px;
  max-width: 340px;
  font-size: 0.95rem;
}

.socials {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.socials a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
  transition: background 0.3s, transform 0.3s var(--ease), color 0.3s;
}

.socials a:hover {
  background: var(--gold-500);
  color: var(--indigo-950);
  transform: translateY(-4px);
}

h4 {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 18px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

ul a {
  position: relative;
  transition: color 0.2s, padding 0.3s var(--ease);
}

ul a:hover {
  color: var(--gold-300);
  padding-left: 6px;
}

.contact li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 0.95rem;
}

.contact .icon {
  flex-shrink: 0;
  margin-top: 3px;
  color: var(--teal-300);
}

.bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.88rem;
}

.bottom-inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-block: 22px;
}

@media (max-width: 900px) {
  .cols {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
