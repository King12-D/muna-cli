# muna-cli

`muna-cli` scans a Node/TypeScript project for route definitions and generates basic API test scaffolding.

## What it does

- Detects framework from `package.json` dependencies (`Express`, `NestJS`, `Fastify`, `Hono`)
- Finds route patterns in `.js` and `.ts` files (excluding `node_modules` and `dist`)
- For Express projects, generates `tests/api.test.js` using `supertest`

## Current behavior

- Framework detection supports multiple frameworks.
- Test generation is currently implemented for **Express only**.
- Generated tests assert each route response has status `< 500`.

## Requirements

- [Bun](https://bun.sh/) (used for build and local execution)
- A project with a `package.json` in the working directory

## Install dependencies

```bash
bun install
```

## Build

```bash
bun run build
```

This outputs the CLI to `dist/cli.js`.

## Run

From this repo:

```bash
bun src/cli.ts
```

After building:

```bash
node dist/cli.js
```

If installed as a package with the `bin` entry, use:

```bash
muna
```

## Output

- Route discovery logs in the terminal
- Generated test file: `tests/api.test.js` (Express only)

## Limitations

- Route parsing is regex-based and currently targets common `app/router.METHOD("path")` patterns.
- Generated test file assumes your Express app is importable as `import app from "../app";`.

## Project structure

```text
src/
  cli.ts
  core/
    detect-framework.ts
    find-routes.ts
  generators/
    express-generator.ts
dist/
```
