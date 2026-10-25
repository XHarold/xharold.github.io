import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function htmlFiles(dir = "dist") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory()
      ? htmlFiles(path)
      : path.endsWith(".html")
        ? [path]
        : [];
  });
}

test("all public routes have pre-rendered HTML with useful content", () => {
  for (const path of [
    "index.html",
    "work/index.html",
    "lab/index.html",
    "work/courtgraph/index.html",
    "work/jurisbenchomni/index.html",
    "work/wiring-the-city/index.html",
    "work/city-pulse/index.html",
    "wiring-the-city/index.html",
    "work/ielts-agent/index.html",
    "404.html",
  ]) {
    assert.ok(
      existsSync(`dist/${path}`),
      `${path} must exist without SPA fallback`,
    );
    const html = readFileSync(`dist/${path}`, "utf8");
    assert.match(
      html,
      /<h1(?:\s[^>]*)?>[^]*?<\/h1>/,
      `${path} should contain a rendered heading`,
    );
    assert.match(html, /lang="zh-CN"/);
  }
});

test("home introduces the person and education before projects", () => {
  const home = readFileSync("dist/index.html", "utf8");
  const sections = [
    "hero-title",
    "education-title",
    "internship-title",
    "work-title",
    ...(home.includes('id="notes-title"') ? ["notes-title"] : []),
    "contact-title",
  ];
  const positions = sections.map((id) => home.indexOf(`id="${id}"`));
  assert.ok(
    positions.every(
      (pos, i) => pos >= 0 && (i === 0 || pos > positions[i - 1]),
    ),
  );
  if (!readdirSync("src/content/notes").some((name) => name.endsWith(".md")))
    assert.doesNotMatch(home, /id="notes-title"/);
  assert.match(home, /教育背景/);
  assert.match(home, /Educational Background/);
  assert.match(home, /实习经历/);
  assert.match(home, /Internship/);
  assert.match(home, /同济大学/);
  assert.match(home, /北京邮电大学/);
  assert.match(home, /images\/portrait\.jpg/);
  assert.doesNotMatch(home, /这里先展示两个项目/);
  assert.doesNotMatch(home, /项目之外|查看交互实验/);
  assert.doesNotMatch(home, /同济大学设计学硕士在读｜人工智能与数据设计|<figcaption/);
  assert.match(home, /<span>About<\/span><small>个人经历<\/small>/);
  assert.match(home, /<span>Project<\/span><small>项目<\/small>/);
  assert.match(home, /<span>Contact<\/span><small>联系<\/small>/);
  assert.match(home, /class="contact-email">haaarold@foxmail\.com<\/span>/);
  assert.doesNotMatch(home, /mailto:/);
  assert.equal((home.match(/class="[^"]*brand"[^>]*>Fan Ju<\/a>/g) || []).length, 2);
  assert.match(home, new RegExp(`© ${new Date().getFullYear()} Fan Ju`));
  assert.doesNotMatch(home, /查看完整经历|下载简历|GitHub|resume\.pdf/);
  assert.doesNotMatch(home, /奖项与荣誉|技能/);
  assert.ok(!existsSync("dist/resume.pdf"));
  assert.ok(!existsSync("dist/about/index.html"));
  assert.ok(!existsSync("dist/internship/index.html"));
  assert.doesNotMatch(home, /数字花园|digital garden/i);
  assert.doesNotMatch(home, /href="(?:#|javascript:[^"]*)"/);
});

test("generated internal links and local assets resolve, including nested routes", () => {
  const home = readFileSync("dist/index.html", "utf8");
  const asset = home.match(/(?:src|href)="([^"]*?)assets\//);
  const base = asset?.[1] || "/";
  for (const file of htmlFiles()) {
    const html = readFileSync(file, "utf8");
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|data:|#)/.test(url)) continue;
      const standalone = file.replaceAll("\\", "/").includes("/wiring-the-city/");
      assert.ok(standalone || url.startsWith(base), `${file}: ${url} should respect deployment base ${base}`);
      const clean = decodeURIComponent(url.split(/[?#]/)[0]);
      const target = standalone && !clean.startsWith(base)
        ? join(file, "..", clean)
        : join("dist", clean.slice(base.length));
      assert.ok(
        existsSync(target) || existsSync(join(target, "index.html")),
        `${file}: missing ${url}`,
      );
    }
  }
});

test("Wiring the City replaces City Pulse and its interactive assets are published", () => {
  const home = readFileSync("dist/index.html", "utf8");
  const work = readFileSync("dist/work/index.html", "utf8");
  const detail = readFileSync("dist/work/wiring-the-city/index.html", "utf8");
  const demo = readFileSync("dist/wiring-the-city/index.html", "utf8");
  const legacy = readFileSync("dist/work/city-pulse/index.html", "utf8");
  assert.match(home, /Wiring the City/);
  assert.match(work, /Wiring the City/);
  assert.doesNotMatch(work, /City Pulse/);
  assert.match(detail, /href="\/wiring-the-city\/"/);
  assert.match(demo, /href="\.\.\/work\/wiring-the-city\/"/);
  assert.match(legacy, /url=\/work\/wiring-the-city\//);
  for (const asset of ["styles.css", "main.js", "data/cities.js", "data/diagrams.js", "assets/stamps/london-stamp.svg"]) {
    assert.ok(existsSync(`dist/wiring-the-city/${asset}`), `missing visualization asset: ${asset}`);
  }
});

test("JurisBenchOmni links to the verified repository and the paper remains a status", () => {
  const home = readFileSync("dist/index.html", "utf8");
  const work = readFileSync("dist/work/index.html", "utf8");
  const detail = readFileSync("dist/work/jurisbenchomni/index.html", "utf8");
  assert.match(home, /JurisBenchOmni/);
  assert.match(work, /JurisBenchOmni/);
  assert.match(detail, /https:\/\/github\.com\/jurisbenchomni\/jurisbenchomni/);
  assert.match(detail, /论文在投 · 暂无公开论文链接/);
  assert.doesNotMatch(detail, /\.pdf/);
  for (const slug of ["jurisbenchomni", "wiring-the-city", "courtgraph", "ielts-agent"]) {
    const html = readFileSync(`dist/work/${slug}/index.html`, "utf8");
    assert.doesNotMatch(html, /ROLE \/ 我的角色|个人贡献/);
  }
});

test("review-stage content is private to search engines and project drafts remain labeled", () => {
  const home = readFileSync("dist/index.html", "utf8");
  const work = readFileSync("dist/work/index.html", "utf8");
  for (const slug of ["courtgraph", "ielts-agent"]) {
    assert.match(readFileSync(`dist/work/${slug}/index.html`, "utf8"), /<strong>待完善<\/strong>/);
  }
  assert.equal((work.match(/class="draft-tag">待完善<\/span>/g) || []).length, 2);
  for (const slug of ["jurisbenchomni", "wiring-the-city"]) {
    assert.doesNotMatch(readFileSync(`dist/work/${slug}/index.html`, "utf8"), /<strong>待完善<\/strong>/);
  }
  if (!home.includes("资料校对中")) return;
  assert.match(home, /name="robots"[^>]+content="noindex, nofollow"/);
  assert.match(readFileSync("dist/robots.txt", "utf8"), /Disallow: \//);
  assert.match(
    readFileSync("dist/work/courtgraph/index.html", "utf8"),
    /<strong>待完善<\/strong>/,
  );
  assert.match(home, /北京通用人工智能研究院/);
});
