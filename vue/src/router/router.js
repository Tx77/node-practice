import _ from 'lodash'
import App from '@/App'
import Login from 'pages/Login'
import Index from 'pages/Index'
import Detail from 'pages/Detail'

const childrenRouter = _.union()

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/index',
    name: 'index',
    component: Index
  }, {
    path: '/detail',
    name: 'detail',
    component: Detail
  }, {
    path: '*',
    redirect: '/login'
  }, {
    path: '/',
    name: 'app',
    component: App,
    children: childrenRouter
  }
]
