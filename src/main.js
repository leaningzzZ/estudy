import Vue from 'vue'
import App from './App.vue'
import store from './store/store'

Vue.config.productionTip = false

// 引入ant-design组件库
import Antd from "ant-design-vue"
import notification from "ant-design-vue/lib/notification"
import "ant-design-vue/dist/antd.css";
Vue.use(Antd)

// 引入验证
import Veevalidate,{Validator} from "vee-validate";
import zh_CN from "vee-validate/dist/locale/zh_CN"
Vue.use(Veevalidate);
Vue.$notification=notification;
Validator.localize('zh_CN',zh_CN)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
