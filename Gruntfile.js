
module.exports = function(grunt) {

	grunt.initConfig({
		lint: {
			all:['assets/js/*.js']
		},


		watch: {
			styles: {
				files: ['assets/less/*.less'], 
				tasks: ['less'],
				options: {
					nospawn: true,
					reload: true,
					livereload: {
						port: 1337
					}
				}
			},	

			html: {
				files: ['*.html'], 
				options: {
					reload: true,
					livereload: {
						port: 1337
					}
				}
			},

			js: {
				files: ['assets/js/*.js'], 
				options: {
					reload: true,
					livereload: {
						port: 1337
					}
				}
			},
		},

		less: {
			development: {
				
				files: {
					"assets/css/img-srch.css": "assets/less/img-srch.less",
				}
			},

		}
	});



	grunt.registerTask('serve', [
		'watch'
		]);


	grunt.registerTask('default', 'serve');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');



};