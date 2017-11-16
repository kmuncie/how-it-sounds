'use strict';

var template = require('./annotated-text-field.html');

module.exports = {
   name: 'annotated-text-field',

   template: template,

   props: {
      field: {
         'type': Object,
         'required': true,
      },
   },

   data: function() {
      return {};
   },

   computed: {},

   methods: {},
};
