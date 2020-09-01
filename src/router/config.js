import TabsView from '@/layouts/tabs/TabsView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
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
          path: 'demo',
          name: '演示页',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/demo')
        },
        {
          path: 'mine',
          name: '个人信息',
          meta: {
            icon: 'form'
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
          path: 'one',
          name: '一个',
          meta: {
            icon: 'form'
          },
          component: PageView,
          children: [
            {
              path: 'index',
              name: '列表',
              component: () => import('@/pages/one'),
            }
          ]
        },
      ]
    }
  ]
}

export default options
