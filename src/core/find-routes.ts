import { glob } from "glob";
import fs from "fs";

export interface Route {
  method: string | undefined;
  path: string | undefined;
}

export function findRoutes(framework: string): Route[] {
  const files = glob.sync("**/*.{js,ts}", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const routes: Route[] = [];

  const routeRegex =
    /(app|router)\.(get|post|put|delete|patch)\s*\(\s*["'`](.*?)["'`]/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    let match;

    while ((match = routeRegex.exec(content)) !== null) {
      routes.push({
        method: match[2],
        path: match[3],
      });
    }
  }

  return routes;
}
