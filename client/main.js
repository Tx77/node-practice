import Vue from 'vue';

import VueRouter from 'vue-router';

import routeMap from './router/index.js';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
	mode : 'history',
	routes : routeMap
});

const index = new Vue({
	router
}).$mount('#app');