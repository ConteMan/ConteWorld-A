import TabsView from '@/layouts/tabs/TabsView';
import PageView from '@/layouts/PageView';

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
        // 文章模块
        {
          path: '/article',
          name: '文章',
          meta: {
            icon: 'book'
          },
          component: () => import('@/pages/article/ArticleList.vue'),
        },
        {
          path: '/article/create',
          name: '创建文章',
          meta: {
            invisible: true,
            selectPath: '/article',
          },
          component: () => import('@/pages/article/ArticleCreate'),
        },
        {
          path: '/article/update',
          name: '更新文章',
          meta: {
            invisible: true,
            selectPath: '/article',
          },
          component: () => import('@/pages/article/ArticleUpdate'),
        },
        // 说说
        {
          path: '/talk',
          name: '说说',
          meta: {
            icon: 'message'
          },
          component: () => import('@/pages/talk')
        },
        // 电影
        {
          path: 'movie',
          name: '影视',
          meta: {
            icon: 'video-camera'
          },
          component: () => import('@/pages/movie')
        },
        // 世界线
        {
          path: 'worldline',
          name: '世界线',
          meta: {
            icon: 'compass'
          },
          component: () => import('@/pages/worldline')
        },
        {
          path: 'database',
          name: '数据仓库',
          meta: {
            icon: 'database'
          },
          component: PageView,
          children: [
            {
              path: '/one',
              name: '一个',
              component: () => import('@/pages/one'),
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
            },
            {
              path: 'enum',
              name: '枚举配置',
              component: () => import('@/pages/enum'),
            },
            {
              path: 'token',
              name: 'Token',
              component: () => import('@/pages/token'),
            },
          ]
        },
      ]
    },
  ]
};

export default options;
