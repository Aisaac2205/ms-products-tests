import { test, expect } from "@playwright/test";

/**
 * SUITE: Autenticación
 *
 * Verifica que el sistema de login con JWT funciona correctamente.
 * Estos tests corren primero porque sin token, nada más funciona.
 */
test.describe("Auth - Login con JWT", () => {

  test("Login exitoso devuelve access_token", async ({ request }) => {
    const response = await request.post("/auth/token", {
      form: {
        username: "admin",
        password: "admin1234",
      },
    });

    // Verificar HTTP status
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Verificar estructura de la respuesta
    expect(body).toHaveProperty("access_token");
    expect(body).toHaveProperty("token_type", "bearer");
    expect(typeof body.access_token).toBe("string");
    expect(body.access_token.length).toBeGreaterThan(0);
  });

  test("Login con contraseña incorrecta devuelve 401", async ({ request }) => {
    const response = await request.post("/auth/token", {
      form: {
        username: "admin",
        password: "contraseña-incorrecta",
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body).toHaveProperty("detail");
  });

  test("Login con usuario inexistente devuelve 401", async ({ request }) => {
    const response = await request.post("/auth/token", {
      form: {
        username: "usuario-falso",
        password: "admin1234",
      },
    });

    expect(response.status()).toBe(401);
  });

  test("Request a endpoint protegido sin token devuelve 401", async ({ request }) => {
    // Intentar listar productos sin enviar el token
    const response = await request.get("/products/");

    expect(response.status()).toBe(401);
  });

  test("Request con token inválido devuelve 401", async ({ request }) => {
    const response = await request.get("/products/", {
      headers: {
        Authorization: "Bearer token-completamente-falso",
      },
    });

    expect(response.status()).toBe(401);
  });

});
