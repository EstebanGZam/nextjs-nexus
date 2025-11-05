# Guía de Despliegue - Nexus Project

## Configuración de Vercel

### 1. Crear cuenta y proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta con tu GitHub
2. Click en "Add New Project"
3. Importa el repositorio `nextjs-nexus`
4. Vercel detectará automáticamente que es un proyecto Next.js

### 2. Configuración del proyecto

**Framework Preset:** Next.js (detectado automáticamente)

**Build Command:** `npm run build` (por defecto)

**Output Directory:** `.next` (por defecto)

**Install Command:** `npm install` (por defecto)

**Development Command:** `npm run dev` (por defecto)

### 3. Variables de entorno (si las necesitas)

En el dashboard de Vercel:

- Settings → Environment Variables
- Añade las variables necesarias (ej: `DATABASE_URL`, `API_KEY`, etc.)
- Selecciona para qué entornos aplican: Production, Preview, Development

### 4. Configuración de ramas

**Production Branch:** `main`

- Cada push a `main` → Deploy automático a producción

**Preview Deployments:**

- Cada PR → Preview deployment automático
- Cada push a otras ramas → Preview deployment

### 5. Integración con GitHub (automático)

Una vez conectado, Vercel automáticamente:

- ✅ Crea preview deployments para cada PR
- ✅ Despliega a producción cuando se hace merge a `main`
- ✅ Comenta en los PRs con el link del preview
- ✅ Muestra el estado del deployment en GitHub

## Pipeline CI/CD Completo

```
┌─────────────────────────────────────────────────────────┐
│ Developer push/PR                                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ GitHub Actions CI                                        │
│  ├─ Lint & Type Check                                   │
│  ├─ Unit Tests + Coverage                               │
│  ├─ Build Check                                         │
│  └─ E2E Tests (Chromium)                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
         ┌───────┴───────┐
         │   CI Pass?    │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
       NO                YES
        │                 │
        ▼                 ▼
  ❌ Block PR      ✅ Allow merge
                          │
                          ▼
                  ┌───────────────┐
                  │ Merge to main │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Vercel Deploy │
                  │  (Automatic)  │
                  └───────┬───────┘
                          │
                          ▼
                  🚀 Production Live
```

## Comandos útiles

### Local

```bash
# Desarrollo
npm run dev

# Tests
npm test                  # Unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # Con coverage
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # E2E con UI

# Build local
npm run build
npm start

# Linting
npm run lint
npm run lint:fix
npm run format:check
npm run format
npm run type-check
```

### Vercel CLI (opcional)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy a producción
vercel --prod
```

## Monitoreo

**Vercel Dashboard:**

- Logs de deployments
- Analytics
- Performance metrics
- Error tracking

**GitHub:**

- Status checks en PRs
- Actions logs
- Artifacts (coverage, test reports)

## Troubleshooting

### Build falla en Vercel

1. Revisa los logs en Vercel dashboard
2. Verifica que todas las env vars estén configuradas
3. Intenta build local: `npm run build`

### Tests fallan en CI

1. Revisa GitHub Actions logs
2. Descarga artifacts para ver reportes detallados
3. Ejecuta localmente: `npm run test:ci`

### Preview deployment no aparece

1. Verifica que Vercel App esté instalada en el repo
2. Revisa permisos de la Vercel GitHub App
3. Check Vercel dashboard → Settings → Git

## Notas importantes

- ⚠️ No hagas push directo a `main` sin pasar por PR
- ⚠️ Asegúrate que el CI pase antes de hacer merge
- ⚠️ Las env vars de producción son diferentes a las de preview
- ⚠️ Los E2E tests en CI solo usan Chromium (más rápido)
