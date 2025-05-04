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
          component: () => import('@/pages/home/components/blog'),
          children: [
            {
              path: 'search',
              component: () => import('@/pages/home/components/blog/search-page'),
              meta: {
                transition: 'slide-left'
              }
            },
            {
              path: 'detail/:id',
              component: () => import('@/pages/home/components/blog/blog-detail'),
              meta: {
                transition: 'zoom-in'
              }
            }
          ]
        },
        {
          path: 'mall',
          component: () => import('@/pages/home/components/mall'),
          children: [
            {
              path: 'search',
              component: () => import('@/pages/home/components/mall/search-page'),
              meta: {
                transition: 'slide-left'
              }
            },
            {
              path: 'cart',
              component: () => import('@/pages/home/components/mall/cart-page'),
              meta: {
                transition: 'slide-left'
              }
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
      component: () => import('@/components/Search')
    },
    {
      path: "/friend",
      name: "Friend",
      component: () => import("@/pages/friend")
    },
    {
      path: "/publish",
      name: "Publish",
      component: () => import("@/pages/publish"),
      meta: {
        fullscreen: true
      }
    },
    {
      path: "/chat",
      name: "Chat",
      component: () => import("@/pages/chat")
    },
    {
      path: "/chat/window/:id",
      name: "ChatWindow",
      component: () => import("@/pages/chat/components/chat-window")
    },
    {
      path: "/me",
      name: "Me",
      component: () => import("@/pages/me")
    },
    {
      path: "/album",
      name: "Album",
      component: () => import("@/pages/album"),
      meta: {
        fullscreen: true
      }
    }
  ]
})

export default router
