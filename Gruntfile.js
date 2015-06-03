module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      name: '<%= pkg.name %>',
      app: 'app',
      assets: 'app/assets',
      css: 'app/assets/css',
      scss: 'app/assets/scss',
      components: 'app/components'
    },
    sass: {
      dist: {
        files: {
          '<%= project.css %>/application.css': '<%= project.scss %>/application.scss',
          '<%= project.css %>/auth.css': '<%= project.scss %>/auth.scss',
          '<%= project.css %>/shared.css': '<%= project.scss %>/shared.scss'
        }
      }
    },
    watch: {
      css: {
        files: '<%= project.scss %>/*.scss',
        tasks: ['sass']
      }
    },
    copy: {
      main: {
            expand: true,
            flatten: true,
            src: '<%= project.components %>/bootstrap-sass/assets/fonts/bootstrap/*.*',
            dest: '<%= project.assets %>/fonts/bootstrap/'
          }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default',['copy', 'watch']);
}
