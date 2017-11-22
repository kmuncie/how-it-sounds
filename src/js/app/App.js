'use strict';

var template = require('./app.html'),
    AnnotatedTextField = require('./components/annotated-text-field'),
    MyButton = require('./components/my-button');

module.exports = {
   el: '#app',

   name: 'App',

   template: template,

   components: {
      AnnotatedTextField: AnnotatedTextField,
      MyButton: MyButton,
   },

   data: function() {
      return {
         field: { primaryAnnotation: 'Test', sourceText: 'This' }
      };
   },
};
