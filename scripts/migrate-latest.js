#!/usr/bin/env node
/**
 * Runs the latest migration of the migrations folder, the one with the most
 * recent timestamp prefix. The arguments are passed to the migration, for
 * example the configuration files to update, --dry-run or --revert:
 *
 *   npm run migrate:latest
 *   npm run migrate:latest -- /path/to/config.json --dry-run
 */
const fs = require("fs");
const path = require("path");

const MIGRATIONS_DIR = path.resolve(__dirname, "..", "migrations");
// <timestamp>-<name>.js, like the migrations of the backend
const MIGRATION_FILE = /^\d{14}-.+\.js$/;

const latest = fs
  .readdirSync(MIGRATIONS_DIR)
  .filter((file) => MIGRATION_FILE.test(file))
  .sort()
  .pop();

if (!latest) {
  console.error(`No migration found in ${MIGRATIONS_DIR}`);
  process.exit(1);
}

console.log(`Running migration ${latest}`);
process.exit(
  require(path.join(MIGRATIONS_DIR, latest)).run(process.argv.slice(2)),
);
