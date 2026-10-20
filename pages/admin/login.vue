<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' })
useHead({ title: 'Iniciar sesión · Admin Eximedical' })

const auth = useAdminAuth()
const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)
const error = ref('')

const submit = async () => {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'Ingresa tu correo y contraseña.'
    return
  }
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    await navigateTo('/admin')
  }
  catch (e) {
    error.value = (e as Error).message
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="bg" aria-hidden="true">
      <span class="blob b1" />
      <span class="blob b2" />
      <span class="grid" />
    </div>

    <div class="card">
      <img src="/images/logo.png" alt="Eximedical" width="600" height="218" class="logo">
      <h1>Panel de administración</h1>
      <p class="sub">Ingresa con tu cuenta de administrador.</p>

      <form novalidate @submit.prevent="submit">
        <label class="field">
          <span>Correo electrónico</span>
          <div class="input">
            <AppIcon name="mail" :size="18" />
            <input v-model="email" type="email" autocomplete="username" placeholder="admin@eximedical.com">
          </div>
        </label>
        <label class="field">
          <span>Contraseña</span>
          <div class="input">
            <AppIcon name="shield-check" :size="18" />
            <input v-model="password" :type="show ? 'text' : 'password'" autocomplete="current-password" placeholder="••••••••">
            <button type="button" class="eye" :aria-label="show ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="show = !show">
              <AppIcon name="eye" :size="18" />
            </button>
          </div>
        </label>

        <Transition name="err">
          <p v-if="error" class="error">{{ error }}</p>
        </Transition>

        <button type="submit" class="btn btn-primary submit" :disabled="loading">
          <span v-if="loading" class="spinner" /> {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

      <NuxtLink to="/" class="back"><AppIcon name="arrow-right" :size="15" class="flip" /> Volver al sitio</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(120% 120% at 20% 10%, var(--indigo-700), var(--indigo-950) 70%);
  overflow: hidden;
  isolation: isolate;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.4;
  animation: drift 16s ease-in-out infinite alternate;
}

.b1 {
  width: 420px;
  height: 420px;
  background: var(--teal-500);
  bottom: -140px;
  right: 5%;
}

.b2 {
  width: 340px;
  height: 340px;
  background: var(--gold-500);
  top: -100px;
  left: 0;
  animation-delay: -8s;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, #000, transparent 70%);
}

@keyframes drift {
  to { transform: translate(40px, 30px) scale(1.15); }
}

.card {
  width: min(420px, 100%);
  padding: 40px 34px 30px;
  border-radius: 28px;
  background: #fff;
  box-shadow: var(--shadow-lg);
  animation: rise 0.7s var(--ease);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
}

.logo {
  width: 170px;
  height: auto;
  margin: 0 auto 18px;
}

h1 {
  text-align: center;
  font-size: 1.5rem;
  color: var(--indigo-900);
}

.sub {
  text-align: center;
  color: var(--muted);
  margin: 6px 0 26px;
}

form {
  display: grid;
  gap: 16px;
}

.field span {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--indigo-900);
}

.input {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1.5px solid var(--line);
  background: var(--bg);
  color: var(--muted);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.input:focus-within {
  border-color: var(--indigo-500);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(81, 69, 214, 0.12);
}

.input input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: none;
  font: inherit;
  color: var(--ink);
}

.eye {
  border: 0;
  background: none;
  color: var(--muted);
  padding: 4px;
}

.error {
  padding: 10px 14px;
  border-radius: 12px;
  background: #fde8e8;
  color: #b42323;
  font-size: 0.9rem;
}

.err-enter-active {
  animation: shake 0.4s;
}

@keyframes shake {
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.submit {
  width: 100%;
  margin-top: 4px;
}

.submit:disabled {
  opacity: 0.75;
  cursor: wait;
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}


.back {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
  color: var(--muted);
  font-size: 0.9rem;
}

.back:hover {
  color: var(--indigo-700);
}

.flip {
  transform: rotate(180deg);
}
</style>
