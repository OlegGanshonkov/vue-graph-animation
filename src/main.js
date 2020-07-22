import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Graph1 from './components/Graph1.vue';
import Graph2 from './components/Graph2.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Graph1
  },
  {
    path: '/graph1',
    component: Graph1,
    props: true
  },
  {
    path: '/graph2',
    component: Graph2,
    props: true
  },
];
// Errors tracking
/*
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

Sentry.init({
  dsn: 'https://cf7b28bdb1bc4c8d9fb0f6a3561b41be@o423800.ingest.sentry.io/5354651',
  integrations: [new VueIntegration({Vue, attachProps: true, logErrors: true})],
});
*/

Vue.config.productionTip = false

/*
Vue.config.errorHandler = function(err, vm, info) {
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
}
 */

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});