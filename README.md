# Arcanist's Dice - Catalogo Web

Catalogo de productos estatico para **Arcanist's Dice** (El Salvador).
Sitio: [arcanistsdice.com](https://arcanistsdice.com)

---

## Estructura del Proyecto

```
arcanist/
├── scripts/
│   └── generate-manifest/   <- Script que lee Google Drive y genera el catalogo
└── arcanist-catalog/        <- Sitio web Next.js
```

---

## 1. Generar el Catalogo (manifest)

El script lee la carpeta de Google Drive y genera `arcanist-catalog/src/data/catalog.json`.

### Requisitos (primera vez)

1. Colocar el archivo de credenciales de la Service Account en:
   ```
   scripts/generate-manifest/service-account-key.json
   ```
   > Este archivo NO se sube a git. Pedirlo al administrador del proyecto.

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
- Hacer publicas las imagenes en Google Drive automaticamente
- Generar `arcanist-catalog/src/data/catalog.json`

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
# 1. Generar el nuevo catalogo
cd scripts/generate-manifest
node index.js

# 2. Verificar los cambios en catalog.json
# 3. Subir los cambios al repositorio
git add arcanist-catalog/src/data/catalog.json
git commit -m "actualizar catalogo"
git push
```

Vercel detecta el push y reconstruye el sitio automaticamente en pocos minutos.

---

## Configuracion de Contacto

Los links de WhatsApp e Instagram se configuran en:

```
arcanist-catalog/src/lib/config.ts
```

```ts
export const SOCIAL = {
  whatsapp: 'https://wa.me/50372364700',
  instagram: 'https://www.instagram.com/arcanistdice',
  whatsappMessage: 'Hola! Me interesa conocer mas sobre sus productos.',
};
```
