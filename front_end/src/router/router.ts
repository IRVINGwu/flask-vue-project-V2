import { createRouter, createWebHashHistory } from "vue-router";

// const routerHistory = createWebHashHistory(process.env.BASE_URL)
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/news",
      name: "news",
      component: () => import("../views/News.vue"),
    },
    {
      path: "/world",
      name: "world",
      component: () => import("../views/World.vue"),
    },
    {
      path: "/rumors",
      name: "rumors",
      component: () => import("../views/Rumors.vue"),
    },
    {
      path: "/news/:id",
      name: "NewsItem",
      component: () => import("../components/News/NewsItem.vue"),
      props: true,
    },
    {
      path: "/:id",
      name: "ChinaProvin",
      component: () => import("../components/China/ChinaProvin.vue"),
      props: true,
    },
    {
      path: "/world/:id",
      name: "WorldCountry",
      component: () => import("../components/World/WorldCountry.vue"),
      props: true,
    },
    {
      path: "/world/predict/:id",
      name: "WorldPredict",
      component: () => import("../components/World/WorldPredict.vue"),
      props: true,
    },
  ],
});

export default router;
