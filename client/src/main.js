import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import Snotify from 'vue-snotify'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'vue-snotify/styles/material.css'
import "./sass/main.scss"

Vue.use(Antd)
Vue.use(Snotify);
Vue.config.productionTip = false


new Vue({
	router,
	render: h => h(App)
}).$mount("#app")
