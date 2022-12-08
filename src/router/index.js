import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ordenC from '../views/ordencompra/ordenC.vue'
import Seguimiento from '../views/ordencompra/Seguimiento.vue'
import Ordenview from '../views/ordencompra/Ordenview.vue'
import App from './../App.vue'


const routes = [
  {
    path: '/',
    name: 'app',
    component: App,
    children: [
      {
        path: '/orden',
        name: 'ordenC',
        component: ordenC
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      },
      {
        path: '/seguimiento',
        name: 'Seguimiento',
        component: Seguimiento
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      },
      {
        path: '/ordenview',
        name: 'ordenview',
        component: Ordenview
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
