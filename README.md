# 鞠帆｜个人网站

首页将姓名、教育背景、实习经历与个人照片放在同一区域，项目案例供访客继续阅读。个人资料依据网站所有者提供的简历整理；Wiring the City 已接入可交互作品，其他项目案例仍保留待补充内容。使用 Vue 3 + Vite + TypeScript + Tailwind CSS + vite-ssg，可部署到 GitHub Pages。

## 本地运行

项目位于 `D:\Lab\web\fan-ju-portfolio`。先进入该文件夹；需要 Node.js 24 和 npm。

```sh
npm ci
npm run dev
```

终端打印本地预览地址。生产检查与预览：

```sh
npm run build
npm test
npm run preview
```

所有页面会生成真实的 `index.html`，包括项目详情；无须配置 SPA 重写。`dist/404.html` 是 GitHub Pages 的自定义错误页。

## 分区

- Home `/`：左侧姓名、教育背景与实习经历，右侧个人照片 → 两个项目入口 → 实验室入口 → 邮箱；有已发布笔记时才显示笔记区。顶部 About 和 Contact 跳转到首页对应区域。
- Work `/work/`：CourtGraph、Wiring the City、IELTS Agent；详情在 `/work/<slug>/`。Wiring the City 的独立互动页位于 `/wiring-the-city/`，原 `/work/city-pulse/` 会跳转到新案例。
- Lab `/lab/`：可以拖拽、触摸、用方向键或按钮移动节点的 Canvas 实验。
- Notes：有已发布笔记时在首页列出，正文为 `/notes/<slug>/`，不增加一级导航。

## 更新个人信息

编辑 `src/data/profile.ts`：

- `name`、`englishName` 和 `wordmark`：姓名、英文名及导航标识。
- `tagline`：网页描述。
- `education`：`period`、`school`、`program`、`details`，首页显示教育经历。
- `experiences`：实习时间、机构、角色、简介及具体工作。
- `email`：网站唯一公开的联系方式。
- `portrait`：当前使用 `/images/portrait.jpg`，文件存放在 `public/` 对应位置。
- `isPlaceholder`：项目内容尚待确认时保持 `true`，使预览页不被搜索引擎收录。

空邮箱不会生成按钮。网站不提供简历下载，也不展示其他个人联系方式。项目仍含占位内容，因此保留 `noindex` 和“资料校对中”标识。

## 更新项目

项目在 `src/content/work/*.md`。修改 Markdown 会更新案例正文；新增文件后重启开发服务器以注册新路由。

```yaml
---
slug: my-project
title: 项目名
subtitle: 一句话介绍
summary: 用于列表与页面描述的摘要
category: AI / PRODUCT
tags: [产品设计, 开发]
role: 实际承担的角色
domain: 项目领域
status: 开发中
placeholder: false
featured: true
order: 4
art: graph
cover: /images/my-project.webp
links:
  - label: GitHub
    url: https://github.com/username/project
---
```

`slug` 使用英文小写与连字符，并保持唯一。`art` 支持 `graph`、`metro`、`learning`；没有真实封面时显示项目图形或带“概念示意”标注的原生矢量图。提供 `cover` 后使用真实截图。`demo: /wiring-the-city/` 可指定站内互动页；`links` 是外部链接，必须使用 HTTP(S)。首页按 `order` 显示前两个 `featured: true` 的项目。

建议正文依次填写：问题与目标、方案与产品取舍、技术实现、成果与反思。CourtGraph 与 IELTS Agent 的案例内容仍待补充；Wiring the City 的介绍依据已发布的演示整理，个人贡献等未确认信息明确标注待补充。

### 更新 Wiring the City 演示

`public/wiring-the-city/` 从同级 `D:\Lab\web\MetroFlow-web` 复制静态页面、`assets/` 与 `data/`，在本仓库的 `index.html` 和 `styles.css` 增加了返回作品集的入口。页面直接使用相对资源路径，构建时整体复制到 `dist/wiring-the-city/`；不依赖额外构建或后端。更新原演示后，同步这些文件并保留作品集返回链接，再运行构建与测试。项目介绍在 `src/content/work/wiring-the-city.md`。

## 添加笔记

在 `src/content/notes/` 新建 Markdown，必需 `title`、`summary`；推荐如下：

```yaml
---
slug: my-first-note
title: 第一篇笔记
summary: 文章摘要
category: AI / PRODUCT
date: '2026-10-19'
tags: [AI, 产品]
draft: false
---
```

日期必须使用引号括起来的 `YYYY-MM-DD` 字符串。`draft: true` 不生成路由、也不出现在首页。首页显示最新三篇已发布笔记；没有已发布笔记时隐藏该区域。新增文件后重启开发服务器。

Markdown 不执行原始 HTML。项目与文章内容均从本地文件构建，不需要 CMS 或数据库。

## Lab 与视觉

- `src/data/lab.ts` 管理实验标题、分类、状态与组件标识。
- `src/components/NodeNetwork.vue` 是节点网络，挂载后绘制，移动端触摸操作与键盘控件可用。
- `src/style.css` 定义配色、响应式布局及动效。字体自托管；无须访问 Google Fonts。
- 界面尊重 `prefers-reduced-motion`；节点实验离开页面后释放动画与观察器。

## 发布到 GitHub Pages

1. 在你的 GitHub 账号下创建公开仓库 `<用户名>.github.io`。如果已存在，先检查现有内容并确认迁移方式，不覆盖现有网站。
2. 将本项目推送至该仓库的 `main` 分支。
3. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 运行 **Deploy Fan Ju Portfolio to GitHub Pages** 工作流，或再次推送主分支。
5. 工作流成功后通过环境输出的地址访问网站，并直接访问、刷新 `/work/courtgraph/` 检查内页；再检查首页 About 和 Contact 锚点。

工作流自动获取域名及仓库子路径，既支持账号主页，也支持 `https://<用户名>.github.io/<仓库名>/`。需要首次在 GitHub 中启用 Pages，工作流不会自行修改仓库管理设置。

本地模拟子路径：复制 `.env.example` 为 `.env.local`，将 `VITE_BASE_PATH` 设为 `/example-repo/` 后构建、预览。正式公开内容时设置 `isPlaceholder: false`；生产 `VITE_SITE_URL` 由工作流提供，也可在本地填入域名来源（不含路径）。公开内容构建时生成站点地图和规范网址。

`public/social-card.svg` 是可编辑的分享图原稿，`public/social-card.png` 是已生成并接入页面元信息的 1200×630 分享图片。修改原稿后重新导出 PNG 即可。

## 发布前内容清单

- [x] 姓名、学校与专业、就读时间、实习、个人照片。
- [ ] CourtGraph 与 IELTS Agent 的真实状态、个人贡献、方案、截图、可验证结果与链接；补充 Wiring the City 的个人贡献与设计过程。
- [x] 邮箱；未公开其他联系方式或简历文件。
- [ ] 删除或替换其余项目的占位说明，不把概念封面作为真实产品截图。
- [ ] 完成后将 `isPlaceholder` 改为 `false`，检查元信息与分享图。

## 验证

`npm run build` 先运行 Vue/TypeScript 检查再静态生成。`npm test` 检查路由 HTML、首页顺序、本地资源和内部链接，以及预览内容的索引设置。拉取请求自动检查；主分支检查通过后部署。浏览器验证还应覆盖手机/桌面布局、节点拖拽、键盘操作、重置和减少动效模式。
