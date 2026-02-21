import { glob } from "glob";
import fs from "fs";

export interface Route {
  method: string;
  path: string;
}

export function findRoutes(): string[] {
  const files = glob.sync("**/*.{ts,js}", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const routes: Route[] = [];

  const routeRegex =
    /(?:app|router)\.(get|post|put|delete|patch|options|head)\s*\(\s*['"`]([^'"`]+)['"`]/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    let match;

    while ((match = routeRegex.exec(content)) !== null) {
      routes.push({
        method: match[2].toUpperCase(),
        path: match[3],
      });
    }
  }

  return routes.map((r) => `${r.method} ${r.path}`);
}
