<script setup lang="ts">
import type { Producto } from '~/utils/tienda'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const toast = useToast()

// ---- Listado ----
const items = ref<Producto[]>([])
const loading = ref(true)

const fetchItems = async () => {
  loading.value = true
  try {
    items.value = await api.list<Producto>('productos')
  }
  catch (e) {
    toast.error(`No se pudieron cargar los productos: ${(e as Error).message}`)
  }
  loading.value = false
}
onMounted(fetchItems)

// Refresca los datos que ve el sitio público después de cada cambio
const afterChange = async () => {
  await fetchItems()
  await loadShopData()
}

// ---- Filtros y paginación ----
const query = ref('')
const category = ref('')
const status = ref<'all' | 'active' | 'hidden'>('all')
const page = ref(1)
const PER_PAGE = 15

const filtered = computed(() => {
  const q = normalizar(query.value.trim())
  return items.value.filter(p =>
    (!q || normalizar(`${p.name} ${p.slug}`).includes(q))
    && (!category.value || p.category === category.value)
    && (status.value === 'all' || (status.value === 'active' ? p.active : !p.active))
  )
})
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)))
const visible = computed(() => filtered.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE))
watch([query, category, status], () => (page.value = 1))

// ---- Formulario ----
const empty = (): Producto => ({
  slug: '', name: '', category: 'equipos-medicos', description: '', images: [], active: true, featured: false, sort: 0
})
const formOpen = ref(false)
const form = ref<Producto>(empty())
const slugTouched = ref(false)
const saving = ref(false)
const submitted = ref(false)
const isNew = computed(() => !form.value.id)

watch(() => form.value.name, (name) => {
  if (isNew.value && !slugTouched.value) form.value.slug = slugify(name)
})

const errors = computed(() => ({
  name: form.value.name.trim().length < 2 ? 'Escribe el nombre del producto.' : '',
  slug: !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.value.slug) ? 'Usa solo minúsculas, números y guiones.' : ''
}))

const openNew = () => {
  form.value = empty()
  form.value.sort = (items.value.at(-1)?.sort ?? 0) + 1
  slugTouched.value = false
  submitted.value = false
  formOpen.value = true
}

const openEdit = (p: Producto) => {
  form.value = { ...p, images: [...p.images], description: p.description ?? '' }
  slugTouched.value = true
  submitted.value = false
  formOpen.value = true
}

const save = async () => {
  submitted.value = true
  if (errors.value.name || errors.value.slug) return
  saving.value = true
  const { id, ...rest } = form.value
  const payload = {
    slug: rest.slug,
    name: rest.name.trim(),
    category: rest.category,
    description: rest.description?.trim() ?? '',
    images: rest.images,
    active: rest.active,
    featured: rest.featured,
    sort: Number(rest.sort) || 0
  }
  try {
    if (id) await api.update('productos', id, payload)
    else await api.create('productos', payload)
  }
  catch (e) {
    toast.error(`No se pudo guardar: ${(e as Error).message}`)
    return
  }
  finally {
    saving.value = false
  }
  toast.success(id ? 'Producto actualizado' : 'Producto creado')
  formOpen.value = false
  await afterChange()
}

// ---- Cambios rápidos desde la tabla ----
const busy = ref<number | null>(null)
const quickUpdate = async (p: Producto, patch: Partial<Producto>, message: string) => {
  busy.value = p.id!
  try {
    Object.assign(p, await api.update<Producto>('productos', p.id!, patch))
  }
  catch (e) {
    return toast.error(`No se pudo actualizar: ${(e as Error).message}`)
  }
  finally {
    busy.value = null
  }
  toast.success(message)
  await loadShopData()
}

// ---- Eliminar ----
const toDelete = ref<Producto | null>(null)
const confirmOpen = computed({ get: () => !!toDelete.value, set: v => !v && (toDelete.value = null) })
const deleting = ref(false)

const remove = async () => {
  const p = toDelete.value
  if (!p) return
  deleting.value = true
  try {
    await api.remove('productos', p.id!)
  }
  catch (e) {
    return toast.error(`No se pudo eliminar: ${(e as Error).message}`)
  }
  finally {
    deleting.value = false
    toDelete.value = null
  }
  toast.success(`"${p.name}" eliminado`)
  await afterChange()
}
</script>

<template>
  <div>
    <div class="adm-head">
      <p>{{ items.length }} productos en total · {{ items.filter(p => p.active).length }} publicados</p>
      <button class="adm-btn" @click="openNew"><AppIcon name="bag" :size="18" /> Nuevo producto</button>
    </div>

    <div class="adm-filters">
      <label class="adm-search">
        <AppIcon name="search" :size="18" />
        <input v-model="query" type="search" placeholder="Buscar por nombre..." aria-label="Buscar productos">
      </label>
      <select v-model="category" class="adm-select" aria-label="Categoría">
        <option value="">Todas las categorías</option>
        <option v-for="c in categorias" :key="c.slug" :value="c.slug">{{ c.name }}</option>
      </select>
      <select v-model="status" class="adm-select" aria-label="Estado">
        <option value="all">Todos los estados</option>
        <option value="active">Publicados</option>
        <option value="hidden">Ocultos</option>
      </select>
    </div>

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr>
            <th style="width: 76px">Imagen</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Publicado</th>
            <th style="text-align: right">Acciones</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="n in 6" :key="n" class="adm-skeleton"><td colspan="5" /></tr>
        </tbody>
        <tbody v-else>
          <tr v-for="p in visible" :key="p.id">
            <td class="adm-col-img"><img :src="imagenDe(p)" alt="" class="adm-thumb" loading="lazy"></td>
            <td class="adm-name">
              <strong>{{ p.name }}</strong>
              <small>/producto/{{ p.slug }}</small>
            </td>
            <td><span class="adm-chip">{{ getCategoria(p.category)?.name ?? p.category }}</span></td>
            <td>
              <AdminSwitch
                :model-value="!!p.active"
                :disabled="busy === p.id"
                @update:model-value="quickUpdate(p, { active: $event }, $event ? 'Producto publicado' : 'Producto oculto')"
              />
            </td>
            <td>
              <div class="adm-actions">
                <button
                  class="adm-icon-btn"
                  :class="{ on: p.featured }"
                  :title="p.featured ? 'Quitar de destacados' : 'Marcar como destacado'"
                  @click="quickUpdate(p, { featured: !p.featured }, p.featured ? 'Quitado de destacados' : 'Marcado como destacado')"
                >
                  <AppIcon name="award" :size="17" />
                </button>
                <a :href="`/producto/${p.slug}`" target="_blank" class="adm-icon-btn" title="Ver en el sitio"><AppIcon name="external" :size="17" /></a>
                <button class="adm-icon-btn" title="Editar" @click="openEdit(p)"><AppIcon name="clipboard" :size="17" /></button>
                <button class="adm-icon-btn danger" title="Eliminar" @click="toDelete = p"><AppIcon name="x" :size="17" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && !filtered.length" class="adm-empty">
        {{ items.length ? 'Ningún producto coincide con los filtros.' : 'Aún no hay productos. Crea el primero o ejecuta la migración.' }}
      </div>

      <div v-if="filtered.length > PER_PAGE" class="adm-pager">
        <span>Página {{ page }} de {{ pages }} · {{ filtered.length }} resultados</span>
        <div>
          <button class="adm-btn ghost" :disabled="page === 1" @click="page--">Anterior</button>
          <button class="adm-btn ghost" :disabled="page === pages" @click="page++">Siguiente</button>
        </div>
      </div>
    </div>

    <!-- Formulario crear / editar -->
    <AdminDrawer
      v-model="formOpen"
      :title="isNew ? 'Nuevo producto' : 'Editar producto'"
      :subtitle="isNew ? 'Completa los datos y guarda.' : form.name"
    >
      <form class="adm-form" @submit.prevent="save">
        <label class="adm-field" :class="{ error: submitted && errors.name }">
          <span>Nombre *</span>
          <input v-model="form.name" class="adm-input" type="text" placeholder="Ej: Camilla hidráulica">
          <small v-if="submitted && errors.name">{{ errors.name }}</small>
        </label>

        <label class="adm-field" :class="{ error: submitted && errors.slug }">
          <span>Identificador en la URL (slug)</span>
          <input v-model="form.slug" class="adm-input" type="text" @input="slugTouched = true">
          <small>{{ submitted && errors.slug ? errors.slug : `eximedical.com/producto/${form.slug || '...'}` }}</small>
        </label>

        <div class="adm-row">
          <label class="adm-field">
            <span>Categoría *</span>
            <select v-model="form.category" class="adm-input">
              <option v-for="c in categorias" :key="c.slug" :value="c.slug">{{ c.name }}</option>
            </select>
          </label>
          <label class="adm-field">
            <span>Orden</span>
            <input v-model.number="form.sort" class="adm-input" type="number">
            <small>Menor número = aparece primero.</small>
          </label>
        </div>

        <label class="adm-field">
          <span>Descripción</span>
          <textarea v-model="form.description" class="adm-input" rows="5" placeholder="Características, medidas, marca, modelo..." />
        </label>

        <div class="adm-field">
          <span>Imágenes</span>
          <AdminUpload v-model="form.images" bucket="productos" multiple label="Arrastra las fotos aquí o haz clic" />
          <small>La primera imagen es la principal. Recomendado: fondo blanco.</small>
        </div>

        <div class="adm-toggles">
          <AdminSwitch v-model="form.active" label="Publicado" hint="Visible en la tienda del sitio." />
          <AdminSwitch v-model="form.featured" label="Destacado" hint="Aparece primero en el orden destacado." />
        </div>
        <button type="submit" hidden />
      </form>

      <template #footer>
        <button class="adm-btn ghost" @click="formOpen = false">Cancelar</button>
        <button class="adm-btn" :disabled="saving" @click="save">
          <AppIcon name="check" :size="18" /> {{ saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios' }}
        </button>
      </template>
    </AdminDrawer>

    <AdminConfirm
      v-model="confirmOpen"
      title="¿Eliminar producto?"
      :message="`Se eliminará “${toDelete?.name}” y sus imágenes. Esta acción no se puede deshacer.`"
      :loading="deleting"
      @confirm="remove"
    />
  </div>
</template>
