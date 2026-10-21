import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import Home from "./pages/Home.vue";
import Work from "./pages/Work.vue";
import Detail from "./pages/Detail.vue";
import Lab from "./pages/Lab.vue";
import NotFound from "./pages/NotFound.vue";
import { projects, notes } from "./lib/content";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/noto-sans-sc/400.css";
import "./style.css";

export const createApp = ViteSSG(App, {
  base: import.meta.env.BASE_URL,
  routes: [
    { path: "/", component: Home },
    { path: "/work/", component: Work },
    ...projects.map((project) => ({
      path: `/work/${project.slug}/`,
      component: Detail,
      props: { entry: project, kind: "work" },
    })),
    { path: "/lab/", component: Lab },
    ...notes.map((note) => ({
      path: `/notes/${note.slug}/`,
      component: Detail,
      props: { entry: note, kind: "note" },
    })),
    { path: "/404/", component: NotFound },
    { path: "/:pathMatch(.*)*", component: NotFound },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 100 };
    if (to.path !== from.path) return { top: 0 };
  },
});
