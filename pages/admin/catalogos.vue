<script setup lang="ts">
import type { Catalogo } from '~/utils/catalogos'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const toast = useToast()

// ---- Listado ----
const items = ref<Catalogo[]>([])
const loading = ref(true)

const fetchItems = async () => {
  loading.value = true
  try {
    items.value = await api.list<Catalogo>('catalogos')
  }
  catch (e) {
    toast.error(`No se pudieron cargar los catálogos: ${(e as Error).message}`)
  }
  loading.value = false
}
onMounted(fetchItems)

const afterChange = async () => {
  await fetchItems()
  await loadShopData()
}

const query = ref('')
const group = ref('')
const filtered = computed(() => {
  const q = normalizar(query.value.trim())
  return items.value.filter(c =>
    (!q || normalizar(`${c.title} ${c.description}`).includes(q))
    && (!group.value || c.group === group.value)
  )
})

// ---- Formulario ----
const empty = (): Catalogo => ({
  slug: '', title: '', description: '', img: '', pdf: '', size: '', group: 'Equipamiento', featured: false, active: true, sort: 0
})
const formOpen = ref(false)
const form = ref<Catalogo>(empty())
const slugTouched = ref(false)
const saving = ref(false)
const submitted = ref(false)
const isNew = computed(() => !form.value.id)

// AdminUpload trabaja con listas: se adapta a un solo archivo
const imgList = computed({ get: () => (form.value.img ? [form.value.img] : []), set: v => (form.value.img = v[0] ?? '') })
const pdfList = computed({ get: () => (form.value.pdf ? [form.value.pdf] : []), set: v => (form.value.pdf = v[0] ?? '') })

watch(() => form.value.title, (title) => {
  if (isNew.value && !slugTouched.value) form.value.slug = slugify(title)
})

const errors = computed(() => ({
  title: form.value.title.trim().length < 2 ? 'Escribe el título del catálogo.' : '',
  slug: !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.value.slug) ? 'Usa solo minúsculas, números y guiones.' : '',
  pdf: !form.value.pdf ? 'Sube el archivo PDF.' : ''
}))

const openNew = () => {
  form.value = empty()
  form.value.sort = (items.value.at(-1)?.sort ?? 0) + 1
  slugTouched.value = false
  submitted.value = false
  formOpen.value = true
}

const openEdit = (c: Catalogo) => {
  form.value = { ...c }
  slugTouched.value = true
  submitted.value = false
  formOpen.value = true
}

const save = async () => {
  submitted.value = true
  if (Object.values(errors.value).some(Boolean)) return
  saving.value = true
  const { id, ...rest } = form.value
  const payload = {
    slug: rest.slug,
    title: rest.title.trim(),
    description: rest.description.trim(),
    img: rest.img,
    pdf: rest.pdf,
    size: rest.size,
    group: rest.group,
    featured: !!rest.featured,
    active: !!rest.active,
    sort: Number(rest.sort) || 0
  }
  try {
    // El servidor se encarga de que solo un catálogo sea el destacado
    if (id) await api.update('catalogos', id, payload)
    else await api.create('catalogos', payload)
  }
  catch (e) {
    toast.error(`No se pudo guardar: ${(e as Error).message}`)
    return
  }
  finally {
    saving.value = false
  }
  toast.success(id ? 'Catálogo actualizado' : 'Catálogo creado')
  formOpen.value = false
  await afterChange()
}

const busy = ref<number | null>(null)
const quickUpdate = async (c: Catalogo, patch: Partial<Catalogo>, message: string) => {
  busy.value = c.id!
  try {
    await api.update('catalogos', c.id!, patch)
  }
  catch (e) {
    return toast.error(`No se pudo actualizar: ${(e as Error).message}`)
  }
  finally {
    busy.value = null
  }
  toast.success(message)
  await afterChange()
}

// ---- Eliminar ----
const toDelete = ref<Catalogo | null>(null)
const confirmOpen = computed({ get: () => !!toDelete.value, set: v => !v && (toDelete.value = null) })
const deleting = ref(false)

const remove = async () => {
  const c = toDelete.value
  if (!c) return
  deleting.value = true
  try {
    await api.remove('catalogos', c.id!)
  }
  catch (e) {
    return toast.error(`No se pudo eliminar: ${(e as Error).message}`)
  }
  finally {
    deleting.value = false
    toDelete.value = null
  }
  toast.success(`"${c.title}" eliminado`)
  await afterChange()
}
</script>

<template>
  <div>
    <div class="adm-head">
      <p>{{ items.length }} catálogos · {{ items.filter(c => c.active).length }} publicados</p>
      <button class="adm-btn" @click="openNew"><AppIcon name="file-text" :size="18" /> Nuevo catálogo</button>
    </div>

    <div class="adm-filters">
      <label class="adm-search">
        <AppIcon name="search" :size="18" />
        <input v-model="query" type="search" placeholder="Buscar catálogo..." aria-label="Buscar catálogos">
      </label>
      <select v-model="group" class="adm-select" aria-label="Grupo">
        <option value="">Todos los grupos</option>
        <option v-for="g in gruposCatalogo" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr>
            <th style="width: 76px">Portada</th>
            <th>Catálogo</th>
            <th>Grupo</th>
            <th>PDF</th>
            <th>Publicado</th>
            <th style="text-align: right">Acciones</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="n in 5" :key="n" class="adm-skeleton"><td colspan="6" /></tr>
        </tbody>
        <tbody v-else>
          <tr v-for="c in filtered" :key="c.id">
            <td class="adm-col-img"><img :src="c.img || '/images/icono.png'" alt="" class="adm-thumb" style="object-fit: cover"></td>
            <td class="adm-name">
              <strong>{{ c.title }} <span v-if="c.featured" class="adm-chip gold">Destacado</span></strong>
              <small>{{ c.description }}</small>
            </td>
            <td><span class="adm-chip">{{ c.group }}</span></td>
            <td class="adm-col-hide">
              <a v-if="c.pdf" :href="c.pdf" target="_blank" class="pdf-link"><AppIcon name="file-text" :size="16" /> {{ c.size || 'Ver PDF' }}</a>
              <span v-else class="missing">Sin PDF</span>
            </td>
            <td>
              <AdminSwitch
                :model-value="!!c.active"
                :disabled="busy === c.id"
                @update:model-value="quickUpdate(c, { active: $event }, $event ? 'Catálogo publicado' : 'Catálogo oculto')"
              />
            </td>
            <td>
              <div class="adm-actions">
                <button
                  class="adm-icon-btn"
                  :class="{ on: c.featured }"
                  title="Usar como catálogo destacado"
                  :disabled="c.featured"
                  @click="quickUpdate(c, { featured: true }, `“${c.title}” es ahora el destacado`)"
                >
                  <AppIcon name="award" :size="17" />
                </button>
                <button class="adm-icon-btn" title="Editar" @click="openEdit(c)"><AppIcon name="clipboard" :size="17" /></button>
                <button class="adm-icon-btn danger" title="Eliminar" @click="toDelete = c"><AppIcon name="x" :size="17" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !filtered.length" class="adm-empty">
        {{ items.length ? 'Ningún catálogo coincide con la búsqueda.' : 'Aún no hay catálogos. Crea el primero o ejecuta la migración.' }}
      </div>
    </div>

    <AdminDrawer
      v-model="formOpen"
      :title="isNew ? 'Nuevo catálogo' : 'Editar catálogo'"
      :subtitle="isNew ? 'Sube el PDF y su portada.' : form.title"
    >
      <form class="adm-form" @submit.prevent="save">
        <label class="adm-field" :class="{ error: submitted && errors.title }">
          <span>Título *</span>
          <input v-model="form.title" class="adm-input" type="text" placeholder="Ej: Mobiliario médico">
          <small v-if="submitted && errors.title">{{ errors.title }}</small>
        </label>

        <div class="adm-row">
          <label class="adm-field" :class="{ error: submitted && errors.slug }">
            <span>Identificador (slug)</span>
            <input v-model="form.slug" class="adm-input" type="text" @input="slugTouched = true">
            <small v-if="submitted && errors.slug">{{ errors.slug }}</small>
          </label>
          <label class="adm-field">
            <span>Grupo</span>
            <select v-model="form.group" class="adm-input">
              <option v-for="g in gruposCatalogo" :key="g" :value="g">{{ g }}</option>
            </select>
          </label>
        </div>

        <label class="adm-field">
          <span>Descripción corta</span>
          <textarea v-model="form.description" class="adm-input" rows="3" placeholder="Qué incluye este catálogo" />
        </label>

        <div class="adm-field" :class="{ error: submitted && errors.pdf }">
          <span>Archivo PDF *</span>
          <AdminUpload
            v-model="pdfList"
            bucket="catalogos"
            folder="pdf"
            accept="application/pdf"
            label="Arrastra el PDF aquí o haz clic"
            @uploaded="form.size = formatSize($event.size)"
          />
          <small v-if="submitted && errors.pdf">{{ errors.pdf }}</small>
          <small v-else-if="form.size">Tamaño: {{ form.size }}</small>
        </div>

        <div class="adm-field">
          <span>Imagen de portada</span>
          <AdminUpload v-model="imgList" bucket="catalogos" folder="portadas" label="Arrastra la imagen aquí o haz clic" />
          <small>Recomendado: imagen cuadrada de al menos 600 × 600 px.</small>
        </div>

        <div class="adm-row">
          <label class="adm-field">
            <span>Orden</span>
            <input v-model.number="form.sort" class="adm-input" type="number">
          </label>
        </div>

        <div class="adm-toggles">
          <AdminSwitch v-model="form.active" label="Publicado" hint="Visible en la página de catálogos." />
          <AdminSwitch v-model="form.featured" label="Destacado" hint="Se muestra en grande arriba de la página (solo uno)." />
        </div>
        <button type="submit" hidden />
      </form>

      <template #footer>
        <button class="adm-btn ghost" @click="formOpen = false">Cancelar</button>
        <button class="adm-btn" :disabled="saving" @click="save">
          <AppIcon name="check" :size="18" /> {{ saving ? 'Guardando...' : isNew ? 'Crear catálogo' : 'Guardar cambios' }}
        </button>
      </template>
    </AdminDrawer>

    <AdminConfirm
      v-model="confirmOpen"
      title="¿Eliminar catálogo?"
      :message="`Se eliminará “${toDelete?.title}”, su PDF y su portada. Esta acción no se puede deshacer.`"
      :loading="deleting"
      @confirm="remove"
    />
  </div>
</template>

<style scoped>
.adm-chip.gold {
  margin-left: 6px;
  background: #fff3d6;
  color: var(--gold-600);
  font-size: 0.7rem;
  vertical-align: middle;
}

.adm-name small {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pdf-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #b42323;
  font-weight: 600;
  white-space: nowrap;
}

.pdf-link:hover {
  text-decoration: underline;
}

.missing {
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
