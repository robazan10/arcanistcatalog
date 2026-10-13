# Arcanist's Dice - Catalogo Web

Catalogo de productos estatico para **Arcanist's Dice** (El Salvador).
Sitio: [www.arcanistsdice.com](https://www.arcanistsdice.com) (español en `/`, inglés en `/en/`)

La documentacion para continuar el trabajo (estado actual, decisiones, arquitectura, reglas y pantallas) esta en [`docs/README.md`](docs/README.md), en ingles.

---

## Estructura del Proyecto

```
arcanist/
├── scripts/
│   └── generate-manifest/   <- Script que lee Google Drive y genera el catalogo
├── arcanist-catalog/        <- Sitio web Next.js
└── docs/                    <- Documentacion del proyecto y maquetas
```

---

## 1. Generar el Catalogo (manifest)

El script lee la carpeta de Google Drive y genera `arcanist-catalog/src/data/catalog.json`.

### Requisitos (primera vez)

1. Colocar el archivo de credenciales de la Service Account en:
   ```
   scripts/generate-manifest/service-account-key.json
   ```
   > Este archivo NO se sube a git (el repositorio es publico). El dueno lo guarda en Google Drive, en `My Drive/3D Arcanist/`. Copiarlo con el nombre `service-account-key.json` y protegerlo con `chmod 600 service-account-key.json`.

2. Verificar que el `rootFolderId` en `scripts/generate-manifest/config.json` sea correcto:
   ```json
   {
     "rootFolderId": "ID_DE_LA_CARPETA_RAIZ_EN_DRIVE"
   }
   ```
   El ID se obtiene de la URL de Google Drive:
   `https://drive.google.com/drive/folders/`**`ESTE_ES_EL_ID`**

3. Instalar dependencias (solo la primera vez):
   ```bash
   cd scripts/generate-manifest
   npm install
   ```

### Correr el script

```bash
cd scripts/generate-manifest
node index.js
```

El script va a:
- Explorar la carpeta raiz en Google Drive (ROOT > BRAND > PRODUCTO)
- Leer el `meta.txt` de cada carpeta de producto
- Omitir productos que no tengan `meta.txt`
- Poner primero la imagen `cover` de cada producto (ver abajo)
- Incluir los productos sin fotos; el sitio los muestra como "Fotos pronto"
- Hacer publicas las imagenes en Google Drive automaticamente
- Generar `arcanist-catalog/src/data/catalog.json`
- Generar `docs/catalog-status.md`: productos sin fotos, sin `cover` y carpetas omitidas

### Formato de `meta.txt`

Cada carpeta de producto en Google Drive debe tener un archivo `meta.txt`:

```
name=Nombre del Producto
category=Categoria del Producto
tags=tag1, tag2, tag3
images=Image_1.jpg, Image_3.jpg
```

| Campo    | Requerido | Descripcion                                                        |
|----------|-----------|--------------------------------------------------------------------|
| name     | Si        | Nombre del producto                                                |
| category | Si        | Categoria (agrupa los tabs del catalogo)                           |
| tags     | No        | Etiquetas separadas por coma                                       |
| images   | No        | Imagenes especificas a mostrar. Si se omite, se usan todas        |

### Imagen de portada (`cover`)

En cada carpeta de producto, la imagen llamada `cover` (o `Cover`, con cualquier extension: `cover.jpg`, `Cover.png`...) es la que se muestra en la tarjeta del catalogo y la primera al abrir el producto. Las demas van en orden de nombre (`_01`, `_02`, ..., `_10`).

Si una carpeta no tiene `cover`, se usa la primera por nombre y el script muestra una advertencia. Al final indica cuantos productos no tienen `cover`.

### Identificadores

El id de cada producto es marca + nombre (`tanuki-voldemort`), porque hay personajes con el mismo nombre en dos marcas.

---

## 2. Correr el Sitio Localmente

### Requisitos

- Node.js 18 o superior

### Instalacion (primera vez)

```bash
cd arcanist-catalog
npm install
```

### Modo desarrollo

```bash
cd arcanist-catalog
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build de produccion

```bash
cd arcanist-catalog
npm run build
```

Genera la carpeta `out/` con el sitio estatico listo para desplegar.

---

## 3. Flujo de Actualizacion del Catalogo

Cuando el dueno agrega nuevos productos en Google Drive:

```bash
# 1. Crear una rama
git checkout -b data/catalogo-AAAA-MM-DD

# 2. Generar el nuevo catalogo (hace publicas las fotos nuevas en Drive)
cd scripts/generate-manifest
node index.js

# 3. Revisar el resumen del script, catalog.json y docs/catalog-status.md
# 4. Subir la rama y abrir un PR
git add arcanist-catalog/src/data/catalog.json docs/catalog-status.md
git commit
git push -u origin HEAD
gh pr create
```

Al hacer merge del PR, Vercel reconstruye el sitio automaticamente en pocos minutos. `docs/catalog-status.md` lista los productos sin fotos, sin `cover` y las carpetas omitidas.

---

## Configuracion de Contacto

Los links de WhatsApp e Instagram se configuran en `arcanist-catalog/src/lib/config.ts`:

```ts
export const SOCIAL = {
  whatsapp: 'https://wa.me/50372364700',
  instagram: 'https://www.instagram.com/arcanistdice',
};
```

Los mensajes de WhatsApp (y todos los textos del sitio, en español e ingles) estan en `arcanist-catalog/src/i18n/dictionaries.ts`.
