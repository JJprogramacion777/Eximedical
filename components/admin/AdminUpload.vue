<script setup lang="ts">
import type { Bucket } from '~/composables/useAdminApi'

// Zona para subir archivos (arrastrar y soltar o hacer clic).
// multiple=true → lista de imágenes (la primera es la principal); false → un solo archivo.
const files = defineModel<string[]>({ required: true })
const props = withDefaults(defineProps<{
  bucket: Bucket
  folder?: string
  accept?: string
  multiple?: boolean
  label?: string
}>(), { accept: 'image/*', multiple: false, label: 'Arrastra aquí o haz clic para subir' })
const emit = defineEmits<{ uploaded: [file: File] }>()

const api = useAdminApi()
const toast = useToast()
const input = ref<HTMLInputElement>()
const dragging = ref(false)
const uploading = ref(0)
const isPdf = computed(() => props.accept.includes('pdf'))

const handle = async (list: FileList | null) => {
  if (!list?.length) return
  const selected = props.multiple ? Array.from(list) : [list[0]!]
  uploading.value = selected.length
  for (const file of selected) {
    try {
      const { url } = await api.upload(file, props.bucket, props.folder)
      files.value = props.multiple ? [...files.value, url] : [url]
      emit('uploaded', file)
    }
    catch (e) {
      toast.error((e as Error).message)
    }
    finally {
      uploading.value--
    }
  }
  if (input.value) input.value.value = ''
}

const onDrop = (e: DragEvent) => {
  dragging.value = false
  handle(e.dataTransfer?.files ?? null)
}

const remove = (i: number) => {
  files.value = files.value.filter((_, idx) => idx !== i)
}

const makeMain = (i: number) => {
  const copy = [...files.value]
  const [item] = copy.splice(i, 1)
  files.value = [item!, ...copy]
}

const fileName = (url: string) => decodeURIComponent(url.split('/').pop() ?? '').replace(/^\d+-/, '')
</script>

<template>
  <div class="upload">
    <div v-if="files.length" class="previews" :class="{ single: !multiple }">
      <div v-for="(url, i) in files" :key="url" class="preview" :class="{ main: multiple && i === 0, pdf: isPdf }">
        <a v-if="isPdf" :href="url" target="_blank" rel="noopener" class="pdf-file">
          <AppIcon name="file-text" :size="28" />
          <span>{{ fileName(url) }}</span>
        </a>
        <img v-else :src="url" alt="">
        <span v-if="multiple && i === 0" class="tag">Principal</span>
        <div class="tools">
          <button v-if="multiple && i > 0" type="button" title="Usar como principal" @click="makeMain(i)"><AppIcon name="award" :size="15" /></button>
          <button type="button" title="Quitar" class="danger" @click="remove(i)"><AppIcon name="x" :size="15" /></button>
        </div>
      </div>
    </div>

    <button
      v-if="multiple || !files.length || uploading"
      type="button"
      class="drop"
      :class="{ dragging, busy: uploading }"
      @click="input?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <span v-if="uploading" class="spinner" />
      <AppIcon v-else :name="isPdf ? 'file-text' : 'download'" :size="26" class="up" />
      <strong>{{ uploading ? `Subiendo ${uploading} archivo(s)...` : label }}</strong>
      <small>{{ isPdf ? 'PDF hasta 50 MB' : 'JPG, PNG o WEBP hasta 5 MB' }}</small>
    </button>
    <button v-else type="button" class="replace" @click="input?.click()">
      <AppIcon name="download" :size="15" /> Reemplazar archivo
    </button>

    <input ref="input" type="file" :accept="accept" :multiple="multiple" hidden @change="handle(($event.target as HTMLInputElement).files)">
  </div>
</template>

<style scoped>
.upload {
  display: grid;
  gap: 12px;
}

.previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}

.previews.single {
  grid-template-columns: 1fr;
}

.preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 14px;
  border: 1.5px solid var(--line);
  background: #fff;
  overflow: hidden;
}

.previews.single .preview {
  aspect-ratio: auto;
  height: 170px;
}

.preview.pdf {
  height: auto !important;
}

.preview.main {
  border-color: var(--gold-500);
  box-shadow: 0 0 0 3px rgba(201, 161, 59, 0.2);
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.pdf-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 70px 16px 16px;
  color: var(--indigo-800);
  font-weight: 600;
  word-break: break-all;
}

.pdf-file .icon {
  flex-shrink: 0;
  color: #d03c3c;
}

.tag {
  position: absolute;
  left: 6px;
  bottom: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--gold-500);
  color: var(--indigo-950);
  font-size: 0.7rem;
  font-weight: 700;
}

.tools {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
}

.tools button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 0;
  background: rgba(255, 255, 255, 0.95);
  color: var(--indigo-900);
  box-shadow: var(--shadow-sm);
}

.tools button.danger:hover {
  background: #d03c3c;
  color: #fff;
}

.drop {
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 24px 16px;
  border-radius: 16px;
  border: 2px dashed #c9cadb;
  background: var(--bg);
  color: var(--muted);
  transition: border-color 0.2s, background 0.2s;
}

.drop:hover,
.drop.dragging {
  border-color: var(--indigo-500);
  background: var(--indigo-100);
  color: var(--indigo-700);
}

.drop.busy {
  cursor: wait;
}

.drop strong {
  color: var(--indigo-900);
  font-size: 0.95rem;
}

.drop small {
  font-size: 0.8rem;
}

.up {
  color: var(--indigo-500);
}

.replace {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: none;
  color: var(--indigo-700);
  font-weight: 600;
  padding: 0;
}

.spinner {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid var(--indigo-100);
  border-top-color: var(--indigo-500);
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
