import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {

    login(state,datos_usuario){
      state.usuario = datos_usuario
    }
  },
  actions: {
    ingresarVuex(context,datos_usuario){
      context.commit('login',datos_usuario)
    }

  },
  modules: {
  }
})
