#!/usr/bin/env node

import chalk from "chalk";
import { detectFramework } from "./core/detect-framework";
import { findRoutes } from "./core/find-routes";
import { generateExpressTests } from "./generators/express-generator";

async function main() {
  console.log(chalk.blue("\n  Muna CLI V1 \n"));

  const framework = detectFramework();

  if (!framework) {
    console.log(chalk.red("  No supported framework detected. Exiting.\n"));
    process.exit(1);
  }
  console.log(chalk.green(`  Detected framework: ${framework}\n`));

  const routes = findRoutes(framework);

  if (routes.length === 0) {
    console.log(chalk.yellow("  No routes found in the project.\n"));
    process.exit(0);
  }

  console.log(chalk.yellow(`Found ${routes.length} routes:\n`));
  routes.forEach((route) => {
    console.log(chalk.cyan(`  - ${route}`));
  });

  if (framework === "Express") {
    generateExpressTests(routes);
  }

  console.log(chalk.green("\n  Test generation complete!\n"));
}

main();
