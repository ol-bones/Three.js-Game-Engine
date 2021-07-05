// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

//import BootstrapVue from 'bootstrap-vue';
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';
//Vue.use(BootstrapVue);


import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon);


import router from './router';



import Engine from "./engine/Engine";
import * as THREE from "three";

//window.THREE = require("./libs/three.min.js");
//window.THREE = require("./../../../three.js/build/three.js");

require("./libs/PointerLockControls");
import * as CANNON from 'cannon-es';
//window.CANNON = require("./libs/cannon.min.js");
window.CannonDebugRenderer = require("./libs/CannonDebugRenderer.js.old");
window.OrbitControls = require("./libs/OrbitControls");
window.OBJLoader = require("./libs/OBJLoader.js.old");
window.QuickHull = require("./libs/QuickHull");
window.DragControls = require("./libs/DragControls");
window.ConvexGeometry = require("./libs/ConvexGeometry");
window._ = require("./libs/lodash.min.js");
window.CONFIG = require("./config/config.json");
require("./libs/GLTFLoader");

window.ENGINE = new Engine();

import App from './App';
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
