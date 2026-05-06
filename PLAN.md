# Plan de Implementacion: Arcanist's Dice Catalog

## Resumen del Proyecto

Catalogo web estatico para **Arcanist's Dice** (El Salvador), tienda de dados y accesorios
impresos en resina y pintados a mano. Sin precios. Desplegado en Vercel con dominio propio.

---

## Arquitectura General

```
Google Drive (dueno)
       |
       v
[Script: manifest-generator]   <-- corre manualmente, semanal/mensual
       |
       v
  catalog.json  (manifest)
       |
       v
[Next.js Static Site]          <-- build + deploy a Vercel
       |
       v
  Vercel + Dominio propio
```

---

## Fase 1: Autenticacion con Google Drive

### Enfoque recomendado: Service Account

El dueno crea una **Service Account** en Google Cloud y comparte solo la carpeta raiz con ella.
El script usa el archivo JSON de la Service Account para autenticarse. Nunca se exponen
credenciales personales.

**Pasos manuales del dueno (una sola vez):**
1. Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Habilitar la API de Google Drive
3. Crear una Service Account y descargar el JSON de credenciales
4. En Google Drive: click derecho en la carpeta raiz > Compartir > agregar el email
   de la Service Account con permiso de **Lector**
5. Copiar el ID de la carpeta raiz (aparece en la URL de Drive: `.../folders/<FOLDER_ID>`)

**Ventajas:**
- El dueno controla exactamente que carpeta se comparte
- No se exponen credenciales personales
- Las credenciales de la Service Account se guardan fuera del repositorio git

---

## Fase 2: Script de Generacion de Manifest

### Ubicacion: `/scripts/generate-manifest/`

### Archivos del script

```
scripts/
  generate-manifest/
    index.js          <- script principal
    drive-client.js   <- cliente autenticado de Drive
    parser.js         <- parsea meta.txt
    config.json       <- configuracion publica (ID de carpeta raiz, etc.)
    .gitignore        <- excluye service-account-key.json
    package.json
```

### Archivo de configuracion: `config.json`

```json
{
  "rootFolderId": "1ABC...XYZ",
  "outputPath": "../../src/data/catalog.json",
  "skipWithoutMeta": true
}
```

### Formato de `meta.txt` (evolucionado)

```
name=Nombre del Producto
category=Categoria del Producto
tags=Etiqueta 1, Etiqueta 2, Etiqueta 3
images=Image_1.png, Image_3.png
```

- `images` es **opcional**: si no esta, se incluyen todas las imagenes del folder
- Si el folder no tiene `meta.txt`, el producto se **omite** del manifest

### Logica del script

```
1. Leer config.json
2. Autenticar con Drive usando service-account-key.json
3. Explorar ROOT folder
   └─ Para cada BRAND folder:
      └─ Para cada PRODUCT folder:
         a. Buscar meta.txt -> si no existe, skip
         b. Parsear meta.txt (name, category, tags, images)
         c. Listar archivos de imagen en el folder
         d. Si meta.images esta definido: filtrar por esos nombres
            Si no:                        usar todas las imagenes
         e. Para cada imagen: generar URL publica de Google Drive
         f. Construir entry del producto con { filename, url } por imagen
4. Generar catalog.json con:
   - Array de productos
   - Indice de categorias
   - Indice de tags
```

### Estructura del manifest generado: `catalog.json`

```json
{
  "generatedAt": "2025-01-15T10:00:00Z",
  "products": [
    {
      "id": "nombre-del-producto",
      "name": "Nombre del Producto",
      "brand": "Brand X",
      "category": "Categoria",
      "tags": ["tag1", "tag2"],
      "images": [
        { "filename": "Image_1.png", "url": "https://drive.google.com/..." },
        { "filename": "Image_3.png", "url": "https://drive.google.com/..." }
      ]
    }
  ],
  "categories": [
    {
      "id": "categoria",
      "name": "Categoria",
      "productIds": ["nombre-del-producto", "otro-producto"]
    }
  ],
  "tags": [
    {
      "id": "tag1",
      "name": "Tag 1",
      "productIds": ["nombre-del-producto"]
    }
  ]
}
```

### URLs de imagenes de Google Drive

Las imagenes necesitan ser **publicas** ("Cualquier persona con el enlace puede ver").
El script puede setear esto automaticamente via Drive API al generar el manifest.

URL directa de imagen:
```
https://lh3.googleusercontent.com/d/<FILE_ID>
```
Esta URL es compatible con `next/image` para optimizacion.

---

## Fase 3: Sitio Web Next.js

### Tecnologias

| Herramienta     | Uso                              |
|-----------------|----------------------------------|
| Next.js 14+     | Framework (App Router)           |
| TypeScript      | Tipado                           |
| Tailwind CSS    | Estilos                          |
| next/image      | Optimizacion de imagenes         |
| Static Export   | `output: 'export'` para SEO      |

### Estructura del proyecto

```
arcanist-catalog/
  src/
    app/
      page.tsx              <- pagina principal (catalogo)
      layout.tsx            <- layout con header/footer
    components/
      Catalog.tsx           <- grid de productos con filtros
      ProductCard.tsx       <- tarjeta de producto
      CategoryTabs.tsx      <- tabs por categoria
      FilterBar.tsx         <- busqueda + filtro por tags
      ProductModal.tsx      <- galeria de imagenes del producto
      Header.tsx            <- logo + nav
      Footer.tsx            <- links sociales (WhatsApp, Instagram)
      CTAButton.tsx         <- boton flotante de contacto
    data/
      catalog.json          <- manifest generado por el script
    lib/
      catalog.ts            <- funciones para leer/filtrar catalog.json
    styles/
      globals.css
  public/
    logo.jpg
  next.config.js
  tailwind.config.js
```

### Paleta de Colores (del logo)

```js
// tailwind.config.js
colors: {
  primary:   '#3D35B5',   // Azul real profundo (fondo logo)
  silver:    '#C8C5E8',   // Plata/lavanda (dado)
  teal:      '#40E0C8',   // Verde teal (acentos/llamas)
  purple:    '#7B5EA7',   // Purpura (aura magica)
  dark:      '#1A1640',   // Azul muy oscuro (fondo pagina)
  light:     '#F0EFFE',   // Casi blanco con tinte purpura
}
```

### Funcionalidades del Catalogo

1. **Grid de productos** con tarjeta por producto
   - Imagen principal (primera del array)
   - Nombre, categoria, tags como chips
2. **Tabs por categoria** en la parte superior
   - Tab "Todos" por defecto
3. **Barra de busqueda y filtros**
   - Busqueda por nombre (input)
   - Filtro por tag (multi-select o chips clicables)
4. **Modal de producto**
   - Galeria de imagenes con navegacion
   - Nombre, categoria, tags
   - Boton CTA: "Consultar en WhatsApp" / "Ver en Instagram"
5. **Botones flotantes de contacto**
   - WhatsApp (icono + link configurable)
   - Instagram (icono + link configurable)
6. **SEO**
   - Metadata estatica con nombre de tienda y descripcion
   - Open Graph tags
   - Imagenes con alt text generado desde nombre del producto

### Configuracion de CTAs (archivo de config)

```ts
// src/lib/config.ts
export const SOCIAL = {
  whatsapp: "https://wa.me/50312345678",
  instagram: "https://instagram.com/arcanistsdice",
}
```

---

## Fase 4: Deployment en Vercel

### Flujo de actualizacion del catalogo

```
1. Dueno agrega nuevos productos en Google Drive con sus meta.txt
2. Se corre el script localmente:
   cd scripts/generate-manifest && node index.js
3. Se revisa/aprueba el catalog.json generado en src/data/
4. git commit + git push
5. Vercel detecta el push y hace rebuild automatico
6. Sitio actualizado en produccion
```

### Configuracion Vercel

- `next.config.js`: `output: 'export'`
- Vercel detecta Next.js automaticamente
- Dominio personalizado configurado en Vercel Dashboard
- Variable de entorno: ninguna (todo es estatico)

---

## Fases de Implementacion

| Fase | Descripcion                          | Entregable                    |
|------|--------------------------------------|-------------------------------|
| 1    | Setup Google Cloud + Service Account | Guia de pasos para el dueno   |
| 2    | Script de manifest                   | `scripts/generate-manifest/`  |
| 3    | Estructura Next.js + config          | Proyecto base funcional       |
| 4    | Componentes UI + tema                | Catalogo visual completo      |
| 5    | Integracion catalog.json en UI       | Catalogo con datos reales     |
| 6    | SEO + optimizacion                   | Metadata, OG tags, imagen alt |
| 7    | Deploy en Vercel + dominio           | Sitio en produccion           |

---

## Informacion Pendiente del Dueno

Antes de empezar la implementacion se necesita:

- [ ] Nombre de usuario de **WhatsApp** o numero de telefono para el link
- [ ] Nombre de usuario de **Instagram** (@handle)
- [ ] **Dominio** comprado (para configurarlo en Vercel)
- [ ] Confirmacion de que el dueno puede seguir los pasos de Google Cloud
      para crear la Service Account y compartir la carpeta

---

## Notas Tecnicas

- Las imagenes en Google Drive deben tener permiso publico para ser accesibles sin login.
  El script puede setear esto automaticamente con `drive.permissions.create`.
- `next/image` requiere configurar los dominios permitidos en `next.config.js`:
  ```js
  images: { domains: ['lh3.googleusercontent.com'] }
  ```
- El manifest se commitea al repositorio, por lo que el historial de git sirve como
  auditoria de cambios en el catalogo.
- Para 100+ productos se recomienda implementar busqueda del lado del cliente (no servidor)
  ya que el JSON completo sera pequeno (< 500KB estimado).
