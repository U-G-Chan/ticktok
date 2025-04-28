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
          component: () => import('@/pages/home/components/blog')
        },
        {
          path: 'mall',
          component: () => import('@/pages/home/components/mall'),
          children: [
            {
              path: 'search',
              component: () => import('@/pages/home/components/mall/search-page/index.vue'),
              meta: {
                transition: 'slide-left'
              }
            },
            {
              path: 'cart',
              component: () => import('@/pages/home/components/mall/cart-page/index.vue')
            }
          ]
        },
        {
          path: 'recommend',
          component: () => import('@/pages/home/components/recommend')
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
      component: () => import("@/pages/friend")
    },
    {
      path: "/upload",
      name: "Upload",
      component: () => import("@/pages/upload")
    },
    {
      path: "/chat",
      name: "Chat",
      component: () => import("@/pages/chat")
    },
    {
      path: "/me",
      name: "Me",
      component: () => import("@/pages/me")
    }
  ]
})

export default router
