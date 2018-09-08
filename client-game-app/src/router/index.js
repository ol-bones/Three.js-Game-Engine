import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/Home';
import Play from '@/components/Play';
import Edit from '@/components/Edit';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Play',
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
