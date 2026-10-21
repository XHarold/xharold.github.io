import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import type {} from "vite-ssg";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

function contentPlugin() {
  return {
    name: "portfolio-content",
    resolveId(id: string) {
      if (id === "virtual:portfolio-content") return "\0portfolio-content";
    },
    load(id: string) {
      if (id !== "\0portfolio-content") return;
      const collections = Object.fromEntries(
        ["work", "notes"].map((kind) => {
          const directory = resolve("src/content", kind);
          const entries = readdirSync(directory)
            .filter((name) => name.endsWith(".md"))
            .map((name) => {
              const file = resolve(directory, name);
              this.addWatchFile(file);
              const raw = readFileSync(file, "utf8");
              const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
              if (!match) throw new Error(`Missing YAML frontmatter: ${file}`);
              return {
                path: name,
                data: parse(match[1]!),
                content: raw.slice(match[0].length),
              };
            });
          return [kind, entries];
        }),
      );
      return `export default ${JSON.stringify(collections)}`;
    },
    handleHotUpdate(ctx: {
      file: string;
      server: {
        ws: { send: (data: object) => void };
        moduleGraph: {
          getModuleById: (id: string) => any;
          invalidateModule: (module: any) => void;
        };
      };
    }) {
      if (!ctx.file.endsWith(".md")) return;
      const mod = ctx.server.moduleGraph.getModuleById("\0portfolio-content");
      if (mod) ctx.server.moduleGraph.invalidateModule(mod);
      ctx.server.ws.send({ type: "full-reload" });
    },
  } satisfies import("vite").Plugin;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [contentPlugin(), vue(), tailwindcss()],
    base: env.VITE_BASE_PATH || "/",
    ssgOptions: {
      script: "async",
      formatting: "minify",
      dirStyle: "nested",
    },
  };
});
