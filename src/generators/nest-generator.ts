import fs from "fs";
import path from "path";

type Route = {
  method?: string;
  path?: string;
};

export function generateNestTests(routes: Route[]) {
  // Log skipped routes first
  routes.forEach((r) => {
    if (!r.method || !r.path) {
      console.log(
        `⚠ Skipping invalid route: method=${r.method ?? "undefined"}, path=${r.path ?? "undefined"}`,
      );
    }
  });

  const validRoutes = routes.filter(
    (r): r is Required<Route> => !!r.method && !!r.path,
  );

  if (validRoutes.length === 0) {
    console.log("⚠ No valid routes found. Skipping Nest test generation.");
    return;
  }

  // Ensure tests directory exists
  const testDir = "tests";
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  console.log(`Generating ${validRoutes.length} Nest tests...\n`);

  const tests = validRoutes
    .map(
      (r) => `
it("${r.method.toUpperCase()} ${r.path}", async () => {
  const res = await request(app.getHttpServer()).${r.method}("${r.path}");
  expect(res.status).toBeLessThan(500);
});
`,
    )
    .join("");

  const content = `
import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";

describe("API Tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  ${tests}
});
`;

  fs.writeFileSync(path.join(testDir, "api.test.ts"), content);

  console.log("✔ Nest test file created: tests/api.test.ts\n");
}
