import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import nprogress from 'nprogress'
import echarts from 'echarts'

import App from './App'
import Router from './router/router'
import store from './store'

import '@/style/common.less'
import 'nprogress/nprogress.css'
import 'element-ui/lib/theme-chalk/index.css'

// --- 注册Vue的插件 --- //
Vue.use(Vue => {
  const plugin = {
    VueRouter,
    ElementUI,
  echarts}
  Object.keys(plugin).forEach(key => {
    Vue.use(plugin[key])
  })
})

// --- 实例化路由 --- //
const router = new VueRouter({
  mode: 'history',
  routes: Router
})

// --- beforeRouter --- //
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  nprogress.start()
  next()
})

// ---afterRouter --- //
router.afterEach(route => {
  nprogress.done()
})

// --- 关闭控制台生产环境警告 --- //
Vue.config.productionTip = false

// --- 实例化Vue --- //
// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })

const index = new Vue({
  router,
store}).$mount('#app')
