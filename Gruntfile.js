
module.exports = function(grunt) {

	grunt.initConfig({
		lint: {
			all:['assets/js/*.js']
		},

	
		watch: {
			js: {
		        files: ['assets/js/*.js'], // which files to watch
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
					// "player/assets/css/player.css": "player/assets/less/player.less",
					// "player/assets/css/frameless.css": "player/assets/less/frameless.less"
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