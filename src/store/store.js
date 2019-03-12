// vuex
import Vue from 'vue'
import Vuex from 'vuex'
import user from "./modules/user"
import createPersistedState from 'vuex-persistedstate'//引入Vuex持久化插件
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  },
  plugins: [createPersistedState({
      key: "eStudy",
      paths: ["user"],
      subscriber(store) { //每次数据更新，执行
        store.dispatch("user/checkedLogin")
        // alert(111)
        return function (handler) {
          return store.subscribe(handler)
        }
      }
    })
  ],
})