import fs from "fs";
import { type Route } from "../core/find-routes";

export function generateExpressTests(routes: Route[]) {
  const validRoutes = routes.filter(
    (r): r is Required<Route> => r.method !== undefined && r.path !== undefined,
  );

  if (!fs.existsSync("tests")) {
    fs.mkdirSync("tests");
  }

  const content = `
  import request from "supertest";
  import app from "../app";

  describe("API Tests", () => {
  ${validRoutes
    .map(
      (r) => `
  it("${r.method!.toUpperCase()} ${r.path}", async () => {
    const res = await request(app).${r.method}("${r.path}");
    expect(res.status).toBeLessThan(500);
  });
  `,
    )
    .join("")}
  });
  `;
  validRoutes.forEach((r) => {
    if (!r.method) {
      console.log(`⚠ Skipping route without method: ${r.path}`);
    } else if (!r.path) {
      console.log(`⚠ Skipping route without path: ${r.method.toUpperCase()}`);
    } else {
      console.log(`Generating test for: ${r.method.toUpperCase()} ${r.path}`);
    }
  });

  fs.writeFileSync("tests/api.test.js", content);
}
