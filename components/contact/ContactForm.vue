<script setup lang="ts">
// El formulario arma el mensaje y lo envía por WhatsApp o por correo (no requiere servidor).
const { site } = useAppConfig()

const interests = ['Equipos médicos', 'Mobiliario', 'Instrumental quirúrgico', 'Descartables', 'Modelos anatómicos']

const form = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  interests: [] as string[],
  message: ''
})
const touched = ref(false)
const sent = ref<'whatsapp' | 'email' | null>(null)

const errors = computed(() => ({
  name: form.name.trim().length < 3 ? 'Escribe tu nombre y apellido.' : '',
  email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? 'Ingresa un correo válido.' : '',
  phone: form.phone.replace(/\D/g, '').length < 7 ? 'Ingresa un número de contacto válido.' : '',
  message: form.message.trim().length < 10 ? 'Cuéntanos un poco más (mínimo 10 caracteres).' : ''
}))
const valid = computed(() => Object.values(errors.value).every(e => !e))
const showError = (field: keyof typeof errors.value) => touched.value && errors.value[field]

const toggle = (i: string) => {
  const idx = form.interests.indexOf(i)
  if (idx === -1) form.interests.push(i)
  else form.interests.splice(idx, 1)
}

const buildMessage = () => {
  const lines = [
    'Hola Eximedical, quisiera más información.',
    '',
    `Nombre: ${form.name.trim()}`,
    `Correo: ${form.email.trim()}`,
    `Teléfono: ${form.phone.trim()}`
  ]
  if (form.company.trim()) lines.push(`Empresa / institución: ${form.company.trim()}`)
  if (form.interests.length) lines.push(`Me interesa: ${form.interests.join(', ')}`)
  lines.push('', form.message.trim())
  return lines.join('\n')
}

const send = (channel: 'whatsapp' | 'email') => {
  touched.value = true
  if (!valid.value) return
  const text = buildMessage()
  const url = channel === 'whatsapp'
    ? `${site.whatsapp}?text=${encodeURIComponent(text)}`
    : `mailto:${site.email}?subject=${encodeURIComponent(`Consulta desde la web - ${form.name.trim()}`)}&body=${encodeURIComponent(text)}`
  window.open(url, channel === 'whatsapp' ? '_blank' : '_self')
  sent.value = channel
}

const reset = () => {
  Object.assign(form, { name: '', email: '', phone: '', company: '', interests: [], message: '' })
  touched.value = false
  sent.value = null
}
</script>

<template>
  <div class="form-card">
    <Transition name="swap" mode="out-in">
      <div v-if="sent" key="ok" class="success">
        <svg viewBox="0 0 52 52" class="check" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27l7 7 15-15" />
        </svg>
        <h3>¡Gracias, {{ form.name.split(' ')[0] }}!</h3>
        <p>
          Preparamos tu mensaje en {{ sent === 'whatsapp' ? 'WhatsApp' : 'tu aplicación de correo' }}.
          Solo confirma el envío y nuestro equipo te responderá a la brevedad.
        </p>
        <button class="btn btn-primary" @click="reset">Enviar otra consulta</button>
      </div>

      <form v-else key="form" novalidate @submit.prevent="send('whatsapp')">
        <h3>Escríbenos tu petición</h3>
        <p class="hint">Completa el formulario y nuestro equipo te responderá a la brevedad.</p>

        <div class="row">
          <div class="field" :class="{ error: showError('name') }">
            <input id="f-name" v-model="form.name" type="text" placeholder=" " autocomplete="name">
            <label for="f-name"><AppIcon name="user" :size="16" /> Nombre y apellido *</label>
            <small v-if="showError('name')">{{ errors.name }}</small>
          </div>
          <div class="field" :class="{ error: showError('email') }">
            <input id="f-email" v-model="form.email" type="email" placeholder=" " autocomplete="email">
            <label for="f-email"><AppIcon name="mail" :size="16" /> Correo electrónico *</label>
            <small v-if="showError('email')">{{ errors.email }}</small>
          </div>
        </div>

        <div class="row">
          <div class="field" :class="{ error: showError('phone') }">
            <input id="f-phone" v-model="form.phone" type="tel" placeholder=" " autocomplete="tel">
            <label for="f-phone"><AppIcon name="phone" :size="16" /> Teléfono / celular *</label>
            <small v-if="showError('phone')">{{ errors.phone }}</small>
          </div>
          <div class="field">
            <input id="f-company" v-model="form.company" type="text" placeholder=" " autocomplete="organization">
            <label for="f-company"><AppIcon name="building" :size="16" /> Empresa o institución</label>
          </div>
        </div>

        <fieldset class="interests">
          <legend>¿Qué necesitas?</legend>
          <button
            v-for="i in interests"
            :key="i"
            type="button"
            class="pill"
            :class="{ on: form.interests.includes(i) }"
            :aria-pressed="form.interests.includes(i)"
            @click="toggle(i)"
          >
            <AppIcon :name="form.interests.includes(i) ? 'check' : 'package'" :size="15" /> {{ i }}
          </button>
        </fieldset>

        <div class="field" :class="{ error: showError('message') }">
          <textarea id="f-msg" v-model="form.message" rows="5" placeholder=" " />
          <label for="f-msg"><AppIcon name="message" :size="16" /> Escríbenos tu petición *</label>
          <small v-if="showError('message')">{{ errors.message }}</small>
        </div>

        <div class="actions">
          <button type="submit" class="btn wa">
            <AppIcon name="whatsapp" :size="20" /> Enviar por WhatsApp
          </button>
          <button type="button" class="btn btn-primary" @click="send('email')">
            <AppIcon name="send" :size="18" /> Enviar por correo
          </button>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.form-card {
  padding: clamp(28px, 4vw, 48px);
  border-radius: 28px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}

h3 {
  font-size: 1.8rem;
  color: var(--indigo-900);
}

.hint {
  margin-top: 6px;
  color: var(--muted);
}

form {
  display: grid;
  gap: 18px;
}

form > h3 + .hint {
  margin-bottom: 8px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

/* Campos con etiqueta flotante */
.field {
  position: relative;
}

.field input,
.field textarea {
  width: 100%;
  padding: 26px 16px 10px;
  border-radius: 14px;
  border: 1.5px solid var(--line);
  background: var(--bg);
  font: inherit;
  color: var(--ink);
  outline: 0;
  resize: vertical;
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--indigo-500);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(81, 69, 214, 0.12);
}

.field label {
  position: absolute;
  left: 16px;
  top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.25s var(--ease), color 0.25s;
}

.field input:focus + label,
.field input:not(:placeholder-shown) + label,
.field textarea:focus + label,
.field textarea:not(:placeholder-shown) + label {
  transform: translateY(-11px) scale(0.78);
  color: var(--indigo-700);
}

.field.error input,
.field.error textarea {
  border-color: #e04848;
  animation: shake 0.4s;
}

.field small {
  display: block;
  margin-top: 6px;
  color: #d03c3c;
  font-size: 0.85rem;
}

@keyframes shake {
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.interests {
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.interests legend {
  margin-bottom: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--indigo-900);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1.5px solid var(--line);
  background: #fff;
  color: var(--indigo-900);
  font-size: 0.92rem;
  transition: all 0.3s var(--ease);
}

.pill:hover {
  border-color: var(--indigo-500);
}

.pill.on {
  background: var(--indigo-700);
  border-color: var(--indigo-700);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(47, 36, 144, 0.7);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
}

.btn.wa {
  --btn-bg: #25d366;
  --btn-fg: #fff;
}

.btn.wa:hover {
  box-shadow: 0 14px 30px -10px rgba(37, 211, 102, 0.7);
}

/* Mensaje de éxito */
.success {
  text-align: center;
  padding: 40px 0;
}

.success p {
  margin: 12px auto 28px;
  max-width: 420px;
  color: var(--muted);
}

.check {
  width: 96px;
  height: 96px;
  margin: 0 auto 20px;
}

.check circle {
  fill: none;
  stroke: #25d366;
  stroke-width: 2.5;
  stroke-dasharray: 160;
  stroke-dashoffset: 160;
  animation: draw 0.7s var(--ease) forwards;
}

.check path {
  fill: none;
  stroke: #25d366;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 0.5s var(--ease) 0.6s forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.35s, transform 0.35s var(--ease);
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@media (max-width: 600px) {
  .row {
    grid-template-columns: 1fr;
  }

  .actions .btn {
    width: 100%;
  }
}
</style>
