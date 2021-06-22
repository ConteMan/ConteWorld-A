import TabsView from '@/layouts/tabs/TabsView';
import PageView from '@/layouts/PageView';

// 路由配置
const options = {
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: () => import('@/views/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/exception/403'),
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
          component: () => import('@/views/dashboard')
        },
        // 说说
        {
          path: '/talk',
          name: '说说',
          meta: {
            icon: 'message'
          },
          component: () => import('@/views/talk')
        },
        // 文章模块
        {
          path: '/article',
          name: '文章',
          meta: {
            icon: 'book'
          },
          component: () => import('@/views/article/ArticleList.vue'),
        },
        {
          path: '/article/create',
          name: '创建文章',
          meta: {
            invisible: true,
            selectPath: '/article',
          },
          component: () => import('@/views/article/ArticleCreate'),
        },
        {
          path: '/article/update',
          name: '更新文章',
          meta: {
            invisible: true,
            selectPath: '/article',
          },
          component: () => import('@/views/article/ArticleUpdate'),
        },
        // 电影
        {
          path: 'movie',
          name: '影视',
          meta: {
            icon: 'video-camera'
          },
          component: () => import('@/views/movie')
        },
        // 读书
        {
          path: 'book',
          name: '读书',
          meta: {
            icon: 'book'
          },
          component: () => import('@/views/book')
        },
        // 项目
        {
          path: 'project',
          name: '项目',
          meta: {
            icon: 'project'
          },
          component: () => import('@/views/project')
        },
        // 软件
        {
          path: 'software',
          name: '软件',
          meta: {
            icon: 'rocket'
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '列表',
              component: () => import('@/views/software'),
            },
            {
              path: 'tag',
              name: '标签',
              component: () => import('@/views/softwareTag'),
            },
          ]
        },
        // 数据
        {
          path: 'database',
          name: '数据',
          meta: {
            icon: 'database'
          },
          component: PageView,
          children: [
            {
              path: '/one',
              name: '一个',
              component: () => import('@/views/one'),
            },
          ]
        },
        // 系统管理
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
              component: () => import('@/views/config'),
            },
            {
              path: 'enum',
              name: '枚举配置',
              component: () => import('@/views/enum'),
            },
            {
              path: 'token',
              name: 'Token',
              component: () => import('@/views/token'),
            },
          ]
        },
        // 个人中心
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
              component: () => import('@/views/mine'),
            }
          ]
        },
      ]
    },
  ]
};

export default options;
