import Vue from "vue";
import Vuex from "vuex";
import map from '@/store/modules/map'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    map
  }
})
