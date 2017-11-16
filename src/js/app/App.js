'use strict';

var template = require('./app.html'),
    AnnotatedTextField = require('./components/annotated-text-field');

module.exports = {
   el: '#app',

   name: 'App',

   template: template,

   components: {
      AnnotatedTextField: AnnotatedTextField,
   },

   data: function() {
      return { field: { primaryAnnotation: 'Test', base: 'This' } };
   },
};
