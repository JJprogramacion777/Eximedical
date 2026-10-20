# Eximedical · Sitio web

Sitio de Eximedical (importación y distribución de equipos médicos) hecho con **Nuxt 3**.
Incluye tienda con lista de cotización, catálogos PDF y un **panel de administración** en `/admin`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
```

## Panel de administración (PostgreSQL)

El panel en `/admin` permite crear, editar, ocultar y eliminar **productos** y **catálogos PDF**, con subida de
imágenes y archivos. Los datos se guardan en **PostgreSQL** y los archivos subidos en la carpeta `storage/uploads`.
Si la base de datos no responde, el sitio público sigue funcionando con `data/productos.json` y `data/catalogos.json`.

### 1. Configurar la conexión

Copia `.env.example` como `.env` y completa:

- `DATABASE_URL`: `postgres://postgres:CONTRASEÑA@localhost:5433/eximedical`
- `NUXT_SESSION_PASSWORD`: una clave aleatoria de 32 caracteres o más:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

> Las contraseñas van **solo** en `.env` (está en `.gitignore`). Nunca las escribas en `.env.example`, que sí se sube a GitHub.

### 2. Crear la base de datos y cargar los datos

```bash
npm run db:setup
```

Crea la base `eximedical` si no existe, aplica [`db/schema.sql`](db/schema.sql) y carga los 74 productos y 9 catálogos
(solo si las tablas están vacías). Se puede ejecutar varias veces sin duplicar datos.

### 3. Crear el usuario administrador

```bash
npm run admin:create -- tu@correo.com "TuContraseñaSegura" "Tu nombre"
```

El mismo comando sirve para cambiar la contraseña de un administrador existente. Las contraseñas se guardan cifradas (scrypt).

### 4. Entrar al panel

Reinicia `npm run dev`, abre `http://localhost:3000/admin` e inicia sesión.

> En producción necesitas un servidor con Node.js y acceso a PostgreSQL, con las mismas variables de `.env`
> y una carpeta persistente para `storage/uploads` (o define `UPLOADS_DIR`).

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `pages/` | Páginas públicas (`index`, `nosotros`, `catalogo`, `contacto`, `tienda`, `producto`) y del panel (`admin/`) |
| `components/` | Secciones del sitio (`home/`, `about/`, `catalog/`, `contact/`, `shop/`) y del panel (`admin/`) |
| `composables/` | Datos de la tienda, lista de cotización y llamadas del panel |
| `data/` | Productos y catálogos locales (respaldo y origen de la migración) |
| `db/` | Esquema de la base de datos PostgreSQL |
| `server/` | API: datos públicos, login, gestión del panel y subida de archivos |
| `scripts/` | Preparar la base (`db:setup`) y crear administradores (`admin:create`) |
| `app.config.ts` | Teléfonos, correo, dirección, redes sociales y menú |
