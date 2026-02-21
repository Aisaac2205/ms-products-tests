# ms-products-tests 🧪

Suite de tests E2E para [ms-products-api](https://github.com/Aisaac2205/ms-products-api) usando **Playwright** y **TypeScript**.

![CI](https://github.com/Aisaac2205/ms-products-tests/actions/workflows/ci.yml/badge.svg)

## Stack

- **Playwright** — framework de testing E2E
- **TypeScript** — tipado fuerte en los tests
- **Node.js 20** — runtime

## Estructura de tests

```
tests/
├── e2e/
│   ├── health.spec.ts      # Health check del servicio
│   ├── auth.spec.ts        # Tests de autenticación JWT
│   └── products.spec.ts    # CRUD completo de productos
└── helpers/
    └── api.helper.ts       # Funciones reutilizables para la API
```

## Correr tests localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar browsers de Playwright
npx playwright install chromium

# 3. Asegurarte que ms-products-api está corriendo en localhost:8000

# 4. Correr todos los tests
npm test

# 5. Ver el reporte HTML
npm run test:report
```

## Suites disponibles

| Suite | Archivo | Tests |
|-------|---------|-------|
| Health Check | `health.spec.ts` | 2 |
| Auth JWT | `auth.spec.ts` | 5 |
| Products CRUD | `products.spec.ts` | 12 |

## Cómo se dispara el pipeline

El pipeline corre automáticamente en dos situaciones:

1. **Push a este repo** — cuando modificas o agregas tests
2. **Desde ms-products-api** — cuando el equipo de backend hace push, la API dispara este workflow automáticamente via `workflow_dispatch`

## Secrets necesarios en GitHub

Ir a: Settings → Secrets and variables → Actions

| Secret | Descripción |
|--------|-------------|
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL en CI |
| `SECRET_KEY` | Secret key de FastAPI para JWT |
| `ADMIN_PASSWORD` | Contraseña del usuario admin de la API |
