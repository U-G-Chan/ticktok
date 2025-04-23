import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/pages/home/index.vue")
  },
  {
    path: "/friend",
    name: "Friend",
    component: () => import("@/pages/friend/index.vue")
  },
  {
    path: "/upload",
    name: "Upload",
    component: () => import("@/pages/upload/index.vue")
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("@/pages/chat/index.vue")
  },
  {
    path: "/me",
    name: "Me",
    component: () => import("@/pages/me/index.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
