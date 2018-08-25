import Vue from 'vue'
import Router from 'vue-router'
import Play from '@/components/Play'
import Edit from '@/components/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Play',
      component: Play
    },
    {
      path: '/Editor',
      name: 'Edit',
      component: Edit
    }
  ]
})
