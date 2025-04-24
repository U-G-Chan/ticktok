import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home/recommend'
    },
    {
      path: '/home',
      redirect: '/home/recommend',
      component: () => import('@/pages/home/index.vue'),
      children: [
        {
          path: 'blog',
          component: () => import('@/pages/home/blog.vue')
        },
        {
          path: 'mall',
          component: () => import('@/pages/home/mall.vue')
        },
        {
          path: 'recommend',
          component: () => import('@/pages/home/recommend.vue')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('@/components/Search.vue')
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
  ]
})

export default router
