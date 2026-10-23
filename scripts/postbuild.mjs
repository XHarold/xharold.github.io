import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { join } from "node:path";
import { loadEnv } from "vite";

const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const origin = (env.VITE_SITE_URL || "").replace(/\/$/, "");
const base = env.VITE_BASE_PATH || "/";
const home = readFileSync("dist/index.html", "utf8");
const isPreview = /name="robots"[^>]+content="noindex/.test(home);
if (existsSync("dist/404/index.html"))
  copyFileSync("dist/404/index.html", "dist/404.html");
writeFileSync("dist/.nojekyll", "");

// Preserve bookmarked City Pulse URLs after the project is renamed.
const oldProjectDir = "dist/work/city-pulse";
const newProjectPath = `${base.replace(/\/$/, "")}/work/wiring-the-city/`;
mkdirSync(oldProjectDir, { recursive: true });
writeFileSync(
  join(oldProjectDir, "index.html"),
  `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${newProjectPath}"><title>Wiring the City — Fan Ju</title></head><body><main><h1>City Pulse 已更名为 Wiring the City</h1><p><a href="${newProjectPath}">查看新项目介绍</a></p></main></body></html>`,
);

function pages(dir = "dist") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const path = join(dir, item.name);
    return item.isDirectory()
      ? pages(path)
      : path.endsWith("index.html")
        ? [path]
        : [];
  });
}
if (origin && !isPreview) {
  const urls = pages()
    .filter((path) => !path.replaceAll("\\", "/").includes("/404/"))
    .map((path) => {
      const route = path
        .replaceAll("\\", "/")
        .replace(/^dist\//, "")
        .replace(/index\.html$/, "");
      return `<url><loc>${new URL(`${base}${route}`, origin).href}</loc></url>`;
    });
  writeFileSync(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
  );
  writeFileSync(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${new URL(`${base}sitemap.xml`, origin).href}\n`,
  );
} else {
  writeFileSync(
    "dist/robots.txt",
    isPreview ? "User-agent: *\nDisallow: /\n" : "User-agent: *\nAllow: /\n",
  );
}
console.log(
  `Pages metadata ready (${isPreview ? "preview: noindex" : "public content"}).`,
);
