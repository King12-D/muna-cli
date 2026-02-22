import fs from "fs";
import path from "path";

export function generateHonoTests(
  routes: { method?: string; path?: string }[],
) {
  const validRoutes = routes.filter(
    (r): r is Required<{ method: string; path: string }> =>
      !!r.method && !!r.path,
  );

  if (validRoutes.length === 0) {
    console.log("⚠ No valid routes found. Skipping Hono test generation.");
    return;
  }

  const testDir = "tests";
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  console.log(`Generating ${validRoutes.length} Hono tests...\n`);

  const content = `
  import request from "supertest";
  import app from "../app";

  describe("API Tests", () => {
  ${validRoutes
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

  validRoutes.forEach((r) => {
    if (!r.method) {
      console.log(`⚠ Skipping route without method: ${r.path}`);
    } else if (!r.path) {
      console.log(`⚠ Skipping route without path: ${r.method.toUpperCase()}`);
    } else {
      console.log(`Generating test for: ${r.method.toUpperCase()} ${r.path}`);
    }
  });

  fs.writeFileSync(path.join(testDir, "api.test.js"), content);
}
