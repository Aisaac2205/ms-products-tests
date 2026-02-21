import { APIRequestContext } from "@playwright/test";

/**
 * ApiHelper — centraliza todas las llamadas a la API.
 *
 * En SQA es buena práctica tener un helper para no repetir
 * lógica de requests en cada test. Si la API cambia,
 * solo cambias el helper, no todos los tests.
 */
export class ApiHelper {
  private token: string | null = null;

  constructor(private request: APIRequestContext) { }

  // ── Auth ─────────────────────────────────────────────────
  async login(username = "admin", password = "admin1234"): Promise<string> {
    const response = await this.request.post("/auth/token", {
      form: { username, password },
    });

    const body = await response.json();
    this.token = body.access_token;
    if (!this.token) {
      throw new Error("Login failed: No access token received");
    }
    return this.token;
  }

  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  // ── Products ─────────────────────────────────────────────
  async createProduct(data: {
    name: string;
    price: number;
    description?: string;
    stock?: number;
  }) {
    return this.request.post("/products/", {
      headers: this.getAuthHeaders(),
      data,
    });
  }

  async listProducts(page = 1, pageSize = 10) {
    return this.request.get(`/products/?page=${page}&page_size=${pageSize}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async getProduct(id: number) {
    return this.request.get(`/products/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async updateProduct(id: number, data: object) {
    return this.request.patch(`/products/${id}`, {
      headers: this.getAuthHeaders(),
      data,
    });
  }

  async deleteProduct(id: number) {
    return this.request.delete(`/products/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
