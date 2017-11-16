'use strict';

var Q = require('q'),
    request = require('request'),
    nunjucks = require('nunjucks'),
    path = require('path'),
    _ = require('underscore');

// TODO rewrite as a multi-task to support component-tests
module.exports = function(grunt) {
   grunt.registerTask('render-templates', [], function() {
      var env = nunjucks.configure({ autoescape: false }),
          config = this.options(),
          baseTemplate, partials;

      baseTemplate = grunt.file.read(config.baseTemplatePath);
      partials = grunt.file.expand(config.html.all);

      _.each(partials, function(partialPath) {
         var partial, renderedText, destFile;

         partial = grunt.file.read(partialPath);
         renderedText = env.renderString(baseTemplate, { partial: partial });
         destFile = partialPath.replace(config.html.base, config.dist.base);

         grunt.file.mkdir(path.dirname(destFile));
         grunt.file.write(destFile, renderedText);
         grunt.log.writeln('nunjucks rendered', destFile, 'from', partialPath);
      });
   });
};
