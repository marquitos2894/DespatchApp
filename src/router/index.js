import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ordenC from '../views/ordencompra/ordenC.vue'
import Seguimiento from '../views/ordencompra/Seguimiento.vue'
import Ordenview from '../views/ordencompra/Ordenview.vue'
import CreateDespatch from '../views/guiaremision/CreateDespatch.vue'
import ViewsDespatches from '../views/guiaremision/ViewsDespatches.vue'
import Login from '../views/auth/Login.vue'
import App from './../App.vue'
//import {useAuthStore} from ' pinia 


const routes = [
  {
    path: '/',
    redirect: '/Login',
    name: 'app',
    component: App,
    children: [
      {
        path: '/guiaremisioncreate',
        name: 'CreateDespatch',
        component: CreateDespatch,
        meta:{
          requiresAuth: true
        }
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      },
      {
        path: '/guias',
        name: 'ViewsDespatches',
        component: ViewsDespatches,
        meta:{
          requiresAuth: true
        }
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      },
      {
        path: '/ordenview',
        name: 'ordenview',
        component: Ordenview,
        meta:{
          requiresAuth: true
        }
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//Guards

router.beforeEach((to,from, next)=>{
    //console.log(to, from, next);
  if(to.meta.requiresAuth){
      ///if(store.state.usuario != null){
        //next()
      //}
      let token = localStorage.getItem('access_token');
      if(token != null){
        next()
      }
      next("/Login")
  }

  next();
})


//Pinia
/*router.beforeEach( async (to)=>{
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore()

    if(authRequired && !auth.user){
        auth.returnUrl = to.fullPath
        return '/login'
    }


})*/







export default router
