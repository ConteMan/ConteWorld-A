import TabsView from '@/layouts/tabs/TabsView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: '主页',
          meta: {
            icon: 'dashboard'
          },
          component: () => import('@/pages/dashboard')
        },
        {
          path: 'one',
          name: '一个',
          meta: {
            icon: 'form',
          },
          component: PageView,
          children: [
            {
              path: 'index',
              name: '内容列表',
              component: () => import('@/pages/one'),
            }
          ]
        },
        {
          path: 'article',
          name: '文章',
          meta: {
            icon: 'book'
          },
          component: PageView,
          children: [
            {
              path: 'index',
              name: '文章列表',
              component: () => import('@/pages/article'),
            },
            {
              path: 'create',
              name: '创建文章',
              meta: {
                invisible: true,
                selectPath: '/article/index',
              },
              component: () => import('@/pages/article/ArticleCreate'),
            },
            {
              path: 'update',
              name: '更新文章',
              meta: {
                invisible: true,
                selectPath: '/article/index',
              },
              component: () => import('@/pages/article/ArticleUpdate'),
            },
          ]
        },
        {
          path: 'mine',
          name: '个人中心',
          meta: {
            icon: 'user'
          },
          component: PageView,
          children: [
            {
              path: 'info',
              name: '修改密码',
              component: () => import('@/pages/mine'),
            }
          ]
        },
        {
          path: 'system',
          name: '系统管理',
          meta: {
            icon: 'control'
          },
          component: PageView,
          children: [
            {
              path: 'config',
              name: '系统配置',
              component: () => import('@/pages/config'),
            }
          ]
        },
      ]
    }
  ]
}

export default options
