import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import ToggleButton from "vue-js-toggle-button"

Vue.use(Router)
Vue.use(ToggleButton)

export default new Router({
	routes: [
		{
			path: "/",
			name: "home",
			component: Home
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () =>
				import(/* webpackChunkName: "about" */ "./views/About.vue")
		},
		{
			path: "/settings",
			name: "settings",
			component: () =>
				import("./views/Settings.vue")
		},
		{
			path: "/single",
			name: "single",
			component: () =>
				import("./views/Single.vue")
		}
	]
})
