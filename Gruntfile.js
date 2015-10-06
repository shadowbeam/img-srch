
module.exports = function(grunt) {

	grunt.initConfig({
		lint: {
			all:['js/*.js']
		},

		connect: {
			server: {
				options: {
					livereload: true,
					port: 9000
				}
			}
		},


		watch: {
			styles: {
		        // files: ['player/assets/less/*.less'], // which files to watch
		        // tasks: ['less'],
		        // options: {
		        // 	nospawn: true
		        // }
		    },

		    html: {
		    	// files: [ 'jukebox/*', 'player/*'],
		    	// options: {
		    	// 	reload: true,
		    	// 	livereload: {
		    	// 		port: 35729
		    	// 	}
		    	// }
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
		'connect:server',
		'watch'
		]);


	grunt.registerTask('default', 'serve');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');



};