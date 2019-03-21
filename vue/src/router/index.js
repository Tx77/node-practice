import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/pages/Index.vue'
import Detail from '@/pages/Detail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail
    }
  ]
})
