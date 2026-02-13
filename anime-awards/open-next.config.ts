import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import wasm from "@opennextjs/cloudflare/overrides/wasm.js";
import sqlite from "@opennextjs/cloudflare/overrides/sqlite.js";

export default defineCloudflareConfig({
  overrides: [wasm, sqlite],
});
