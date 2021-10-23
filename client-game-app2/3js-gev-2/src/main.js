import { createApp } from 'vue'
import App from './App.vue'

import router from './router';
import "./libs/bootstrap.css";
import './../src/assets/main.css';

import Engine from "./engine/Engine";
import * as THREE from "three";

import * as CANNON from 'cannon-es';
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'


window.OrbitControls = require("./libs/OrbitControls");
window.OBJLoader = require("./libs/OBJLoader.js");
window.ConvexHull = require("./libs/ConvexHull");
window.DragControls = require("./libs/DragControls");
window.ConvexGeometry = require("./libs/ConvexGeometry");
window._ = require("./libs/lodash.min.js");
window.CONFIG = require("./config/config.json");
require("./libs/GLTFLoader");

window.ENGINE = new Engine();

createApp(App).use(Quasar, quasarUserOptions).use(router).mount('#app')
