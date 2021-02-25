import Vue from 'vue'
import App from '@/App.vue'
import { initRouter } from '@/router'
import store from '@/store'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import '@/utils/lazyUse'
import '@/registerServiceWorker'

import Antd from 'ant-design-vue'

import '@/theme/index.less'
import 'animate.css/source/animate.css'

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.use(Plugins)

Vue.config.productionTip = false

bootstrap({ router, store, i18n, message: Vue.prototype.$message })

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
