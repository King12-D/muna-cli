import fs from "fs";
import path from "path";

export function detectFramework(): string | null {
  if (!fs.existsSync("package.json")) return null;

  const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  if (deps?.express) return "Express";
  if (deps?.nestjs) return "NestJS";
  if (deps?.fastify) return "Fastify";
  if (deps?.hono) return "Hono";

  return null;
}
