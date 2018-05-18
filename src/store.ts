import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    node: null
  },
  mutations: {
    setNode(state, node) {
      state.node = node;
    },
    clearNode(state) {
      state.node = null;
    }
  },
  actions: {}
});
