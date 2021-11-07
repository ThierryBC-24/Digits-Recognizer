const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);

describe("Server tests", () => {
  afterAll(async () => {
    app.close();
  });

  it("GET request to /unknown return 404 status code", async () => {
    const response = await request.get("/unknown");
    expect(response.status).toBe(404);
  });

  it("GET request to /admin return 200 status code", async () => {
    const response = await request.get("/admin");
    expect(response.status).toBe(200);
  });
});
