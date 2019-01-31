import Vue from 'vue'
import Router from 'vue-router'

import circle from '../components/Circle'

let routes = [
  {
    path: '/',
    component: circle
  }
]

Vue.use(Router)
export default new Router({
  routes: routes
})
