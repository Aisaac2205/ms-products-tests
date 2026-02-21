import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Carpeta donde están los tests
  testDir: "./tests/e2e",

  // Timeout por test
  timeout: 30_000,

  // Reintentos en CI (no localmente)
  retries: process.env.CI ? 2 : 0,

  // Correr tests en paralelo
  workers: process.env.CI ? 1 : undefined,

  // Reporte HTML — se sube como artefacto en el pipeline
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"], // También muestra en consola
  ],

  use: {
    // La URL base viene de la variable de entorno (o localhost por defecto)
    baseURL: process.env.BASE_URL || "http://localhost:8000",

    // Guarda trace en caso de fallo (muy útil para debuggear en CI)
    trace: "on-first-retry",

    // Headers por defecto para todos los requests
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },
});
