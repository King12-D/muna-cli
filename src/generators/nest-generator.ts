import fs from "fs";
import path from "path";

export function generateNestTests(
  routes: { method?: string; path?: string }[],
) {
  const validRoutes = routes.filter(
    (r): r is Required<{ method: string; path: string }> =>
      r.method !== undefined && r.path !== undefined,
  );

  if (!fs.existsSync("tests")) {
    fs.mkdirSync("tests");
  }

  const content = `
  import request from "supertest";
  import { Test, TestingModule } from "@nestjs/testing";
  import { INestApplication } from "@nestjs/common";
  import AppModule from "../src/app.module";

  describe("API Tests", () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    ${validRoutes
      .map(
        (r) => `
    it("${r.method.toUpperCase()} ${r.path}", async () => {
      const res = await request(app.getHttpServer()).${r.method}("${r.path}");
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

  fs.writeFileSync(path.join("tests", "api.test.ts"), content);
}
