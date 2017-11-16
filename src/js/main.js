'use strict';

var Vue = require('vue'),
    App = require('./app/App');

require('es6-promise').polyfill();

new Vue(App); // eslint-disable-line no-new
