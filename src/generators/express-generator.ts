import fs from "fs";
import { type Route } from "../core/find-routes";

export function generateExpressTests(routes: Route[]) {
  if (!fs.existsSync("tests")) {
    fs.mkdirSync("tests");
  }

  const content = `
  import request from "supertest";
  import app from "../app";

  describe("API Tests", () => {
  ${routes
    .map(
      (r) => `
    it("${r.method.toUpperCase()} ${r.path}", async () => {
      const res = await request(app).${r.method}("${r.path}");
      expect(res.status).toBeLessThan(500);
    });
  `,
    )
    .join("")}
  });
  `;

  fs.writeFileSync("tests/api.test.js", content);
}
