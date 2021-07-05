import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '@/components/Home';
import Play from '@/components/Play';
import Desert from '@/components/Desert';
import Edit from '@/components/Edit';
import EntityCreate from '@/components/EntityCreate';

const routes = [
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
    path: '/Desert',
    name: 'Desert',
    component: Desert
  },
  {
    path: '/Editor',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/EntityCreator',
    name: 'EntityCreate',
    component: EntityCreate
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
