// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(infiniteScroll)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo (state, nickName) {
      state.nickName = nickName
    },
    updateCartCount (state, cartCount) {
      state.cartCount += cartCount
    },
    initCartCount (state, cartCount) {
      state.cartCount = cartCount
    }
  }
})

Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-balls.svg'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
