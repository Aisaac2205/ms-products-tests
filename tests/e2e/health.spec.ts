import { test, expect } from "@playwright/test";

/**
 * SUITE: Health Check
 *
 * El primer test que debe pasar. Verifica que la API está
 * corriendo antes de ejecutar el resto de las suites.
 * En el pipeline, wait-on hace esto antes de correr Playwright,
 * pero es buena práctica tenerlo también como test documentado.
 */
test.describe("Health Check", () => {

  test("El servicio está corriendo y responde OK", async ({ request }) => {
    const response = await request.get("/health");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("ms-products-api");
  });

  test("La documentación de la API está disponible", async ({ request }) => {
    const response = await request.get("/docs");
    // FastAPI sirve Swagger UI en /docs
    expect(response.status()).toBe(200);
  });

});
