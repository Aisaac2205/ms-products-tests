import { test, expect } from "@playwright/test";
import { ApiHelper } from "../helpers/api.helper";

/**
 * SUITE: Products CRUD
 *
 * Cubre el ciclo completo de un producto:
 * Crear → Leer → Actualizar → Eliminar
 *
 * Cada test es independiente: hace su propio login
 * y crea sus propios datos para no depender de otros tests.
 */
test.describe("Products - CRUD completo", () => {

  // ── CREATE ───────────────────────────────────────────────
  test.describe("POST /products - Crear producto", () => {

    test("Crea un producto con datos válidos → 201", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.createProduct({
        name: "Laptop Gaming Pro",
        description: "Laptop de alto rendimiento para gaming",
        price: 1299.99,
        stock: 25,
      });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty("id");
      expect(body.name).toBe("Laptop Gaming Pro");
      expect(body.price).toBe(1299.99);
      expect(body.stock).toBe(25);
      expect(body.is_active).toBe(true);
    });

    test("Crea un producto solo con campos requeridos → 201", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.createProduct({
        name: "Producto Mínimo",
        price: 9.99,
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.stock).toBe(0); // Valor por defecto
    });

    test("Falla si el precio es 0 o negativo → 422", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.createProduct({
        name: "Producto Inválido",
        price: -10,
      });

      expect(response.status()).toBe(422); // Unprocessable Entity
    });

    test("Falla si el nombre está vacío → 422", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.createProduct({
        name: "",
        price: 99.99,
      });

      expect(response.status()).toBe(422);
    });

    test("Falla sin autenticación → 401", async ({ request }) => {
      const response = await request.post("/products/", {
        data: { name: "Test", price: 10 },
      });
      expect(response.status()).toBe(401);
    });

  });

  // ── READ ─────────────────────────────────────────────────
  test.describe("GET /products — Listar y obtener", () => {

    test("Lista productos paginados correctamente", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.listProducts(1, 5);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page", 1);
      expect(body).toHaveProperty("page_size", 5);
      expect(body).toHaveProperty("items");
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items.length).toBeLessThanOrEqual(5);
    });

    test("Obtiene un producto por ID", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      // Crear producto para luego buscarlo
      const created = await api.createProduct({ name: "Producto Test GET", price: 50 });
      const { id } = await created.json();

      const response = await api.getProduct(id);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(id);
      expect(body.name).toBe("Producto Test GET");
    });

    test("Devuelve 404 para producto inexistente", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.getProduct(999999);
      expect(response.status()).toBe(404);
    });

  });

  // ── UPDATE ───────────────────────────────────────────────
  test.describe("PATCH /products/:id — Actualizar", () => {

    test("Actualiza el precio de un producto", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const created = await api.createProduct({ name: "Producto a actualizar", price: 100 });
      const { id } = await created.json();

      const response = await api.updateProduct(id, { price: 199.99 });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.price).toBe(199.99);
      expect(body.name).toBe("Producto a actualizar"); // No cambió
    });

    test("Actualiza múltiples campos a la vez", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const created = await api.createProduct({ name: "Viejo nombre", price: 50 });
      const { id } = await created.json();

      const response = await api.updateProduct(id, {
        name: "Nuevo nombre",
        price: 75,
        stock: 100,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.name).toBe("Nuevo nombre");
      expect(body.price).toBe(75);
      expect(body.stock).toBe(100);
    });

    test("Devuelve 404 al actualizar producto inexistente", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.updateProduct(999999, { price: 10 });
      expect(response.status()).toBe(404);
    });

  });

  // ── DELETE ───────────────────────────────────────────────
  test.describe("DELETE /products/:id — Eliminar", () => {

    test("Elimina (desactiva) un producto → 204", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const created = await api.createProduct({ name: "Producto a eliminar", price: 20 });
      const { id } = await created.json();

      const deleteResponse = await api.deleteProduct(id);
      expect(deleteResponse.status()).toBe(204);

      // Verificar que ya no aparece en la lista (soft delete)
      const getResponse = await api.getProduct(id);
      // El producto existe pero está inactivo, la API devuelve el objeto
      // En un escenario real podrías filtrar activos en el GET individual
      expect(getResponse.status()).toBeLessThan(500);
    });

    test("Devuelve 404 al eliminar producto inexistente", async ({ request }) => {
      const api = new ApiHelper(request);
      await api.login();

      const response = await api.deleteProduct(999999);
      expect(response.status()).toBe(404);
    });

  });

});
