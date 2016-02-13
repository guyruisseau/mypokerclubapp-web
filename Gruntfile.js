/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global module:false, require:false*/
/* ------------------------- */

module.exports = function (grunt) {
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	var generationDirectory = "grunt-work",
		distributionDirectory = 'dist',
		cacheDirectory = 'grunt-cache',
		loDashFunctions = [
			'mixin', 'map', 'each', 'isUndefined', 'min', 'filter', 'capitalize', 'omit', 'find',
			'sortByOrder', 'groupBy', 'values', 'pluck', 'includes', 'chain', 'partialRight'
		],
		buildConf = {
			uglifiedJSFile: generationDirectory + "/" + Date.now() + ".min.js",
			uglifiedCSSFile: generationDirectory + "/" + Date.now() + ".min.css",
			librariesCache: cacheDirectory + '/libraries.js',
			filesList: {
				libFiles: [
					/* Librairie : jquery */
					'node_modules/jquery/dist/jquery.min.js',
					/* Librairie : bootstrap */
					'node_modules/bootstrap/dist/js/bootstrap.min.js',
					/* Librairie : moment */
					'node_modules/moment/min/moment.min.js',
					'node_modules/moment/locale/fr.js',
					/* Librairie : angular */
					'node_modules/angular/angular.min.js',
					/* Librairie : angular-ui */
					'node_modules/angular-ui-router/release/angular-ui-router.min.js',
					/* Librairie : ng-grid */
					'node_modules/ng-grid/build/ng-grid.min.js',

					/* Librairie : ng-cookies */
					'node_modules/angular-cookies/angular-cookies.min.js',

					/* Librairie : lodash */
					cacheDirectory + '/lodash.js',
					/* Holderjs */
					'node_modules/holderjs/holder.min.js',
					/* ngDialog */
					'node_modules/ng-dialog/js/ngDialog.min.js',
					/* Angular formly (nécessite api-check) */
					'node_modules/api-check/dist/api-check.min.js',
					'node_modules/angular-formly/dist/formly.min.js',
					'node_modules/angular-smart-table/dist/smart-table.min.js',

					'node_modules/angular-bootstrap/dist/ui-bootstrap.min.js',
					'node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.min.js',

					'node_modules/ng-tags-input/build/ng-tags-input.min.js' /*,

					'node_modules/angular-i18n/angular-locale_fr-fr.js'*/



				],
				jsFiles: [
					/* Module mpc-api */
					'js/angular-modules/mpc-api/main.js',
					/* Module mpc-login */
					'js/angular-modules/mpc-login/main.js',
					/* Module mpc-grid */
					'js/angular-modules/mpc-grid/main.js',
					/* Module mpc-webapp */
					'js/app/main.js',
					'js/app/controllers/MainCtrl.js',
					'js/app/controllers/HomeCtrl.js',
					'js/app/controllers/ClubCtrl.js',
					'js/app/controllers/MemberListCtrl.js',
					'js/app/controllers/MemberCtrl.js',
					'js/app/controllers/RankingListCtrl.js',
					'js/app/controllers/RankingCtrl.js',
					'js/app/controllers/MttListCtrl.js',
					'js/app/controllers/MttCtrl.js',
					'js/app/controllers/CgListCtrl.js',
					'js/app/controllers/CgCtrl.js',
					'js/app/controllers/LoginCtrl.js',
					'js/app/directives/imgRep.js',
					'js/app/directives/stringToNumber.js',
					'js/app/directives/tabs.js',
					'js/app/directives/menuClub.js',
					'js/app/directives/onReadFile.js',
					'js/app/directives/pagination.js',
					'js/app/services/MembersService.js',
					'js/app/services/MemberService.js',
					'js/app/services/RankingsService.js',
					'js/app/services/RankingService.js',
					'js/app/services/MttListService.js',
					generationDirectory + '/angular-templates.js'
				],
				cssFiles: [
					/* Librairies */
					'node_modules/bootstrap/dist/css/bootstrap.min.css',
					'css/animate.css',
					'node_modules/ng-dialog/css/ngDialog.min.css',
					'node_modules/ng-dialog/css/ngDialog-theme-default.min.css',
					'node_modules/ng-grid/ng-grid.css',
					'node_modules/ng-tags-input/build/ng-tags-input.min.css',
					/* Classe générique */
					generationDirectory + '/generated.css'
				],
				lessFileDestination: generationDirectory + '/generated.css'
			}
		};

	// Chargement du module de transformation des fichier html
	grunt.loadNpmTasks('grunt-html-build');
    // Chargement du plugin uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Chargement du module de pré-chargement des templates AngularJS
    grunt.loadNpmTasks('grunt-angular-templates');
    // Chargement du module clean de Grunt
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Chargement du module de minification des CSS
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	// Chargement du module de renommage de fichiers
	grunt.loadNpmTasks('grunt-contrib-rename');
	// Module d'affectation uniquement des nouveaux fichiers pour des tâches grunt
	grunt.loadNpmTasks('grunt-newer');
	// Module de transformation des .LESS en .CSS
	grunt.loadNpmTasks('grunt-contrib-less');
	// Chargement du module de copie des fichiers
	grunt.loadNpmTasks('grunt-contrib-copy');
	// Module de compilation de lodash
	grunt.loadNpmTasks('grunt-lodash');
	// Module de concaténation
	grunt.loadNpmTasks('grunt-contrib-concat');

    // Configuration des tâches grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		buildConf: buildConf,
		htmlbuild: {
			prod: {
				src: 'index-template.html',
				dest: generationDirectory + '/',
				options: {
					beautify: true,
					relative: true,
					prefix: 'src/',
					scripts: {
						bundle: [
							generationDirectory + '/*.min.js'
						]
					},
					styles: {
						bundle: [
							generationDirectory + '/*.min.css'
						]
					}
				}
			}
		},
        ngtemplates: {
            webApp: {
                src: ['templates/**/*.html'],
                dest: generationDirectory + '/angular-templates.js',
				options: {
					module: 'mpc.webApp'
				}
            }
        },
		lodash: {
			build: {
				dest: cacheDirectory + '/lodash.js',
				options: {
					modifier: 'modern',
					include: loDashFunctions,
					flags: [
						'--production'
					]
				}
			}
		},
        uglify: {
            options: {
                exportAll: true
            },
            target: {
                files: {
                    '<%= buildConf.uglifiedJSFile %>': buildConf.filesList.jsFiles
                }
            },
			library: {
				files: {
					'<%= buildConf.librariesCache %>': buildConf.filesList.libFiles
				}
			}
        },
		concat: {
			options: {
				separator: ';\n'
			},
			debug: {
				src: [buildConf.librariesCache].concat(buildConf.filesList.jsFiles),
				dest: buildConf.uglifiedJSFile
			},
			libraries: {
				src: [buildConf.librariesCache, buildConf.uglifiedJSFile],
				dest: buildConf.uglifiedJSFile
			}
		},
        clean: {
			destinationDir: [distributionDirectory],
            generateDir: [generationDirectory],
			cacheDir: [cacheDirectory]
        },
        cssmin: {
            target: {
                files: {
                    '<%= buildConf.uglifiedCSSFile %>': buildConf.filesList.cssFiles
                }
            }
        },
		copy: {
			main: {
				files: [
					{ expand: true, flatten: true, src: [generationDirectory + '/*.html'], dest: distributionDirectory + '/' },
					{ expand: true, flatten: true, src: ['images/*.*'], dest: distributionDirectory + '/images/' },
					{ expand: true, flatten: true, src: [generationDirectory + '/*.min.js'], dest: distributionDirectory + '/src/' },
					{ expand: true, flatten: true, src: [generationDirectory + '/*.min.css'], dest: distributionDirectory + '/src/' },
					{ expand: true, flatten: true, src: ['node_modules/bootstrap/dist/fonts/*.*'], dest: distributionDirectory + '/fonts' },
					{ expand: true, flatten: true, src: ['img/*'], dest: distributionDirectory + '/img' },
					{ expand: true, flatten: true, src: ['flaticons/*'], dest: distributionDirectory + '/img' }
				]
			}
		},
		rename: {
			generateIndexFile: {
				files: [
					{src: generationDirectory + '/index-template.html', dest: generationDirectory + '/index.html'}
				]
			}
		},
		less: {
			compile: {
				files: {
					'<%= buildConf.filesList.lessFileDestination %>': ['css/*.less']
				}
			}
		}
    });

	// Tâche principale de grunt
	// A utiliser uniquement lorsqu'on veut recompiler avec lodash
    grunt.registerTask("genall", [
		// Effacement du répertoire du cache
		'clean:cacheDir',
		// Effacement du répertoire de génération s'il existe
		'clean:generateDir',
		// Effacement du répertoire de destination
		'clean:destinationDir',
		// Concaténation des templates AngularJS dans un fichier .js
		'ngtemplates:webApp',
		// Compilation et construction de lodash
		'lodash:build',
		// Minification des librairies
		'newer:uglify:library',
		// Minification des .js + le template.js
		'newer:uglify:target',
		// Concaténation
		'concat:libraries',
		// Compilation des .less en .css
		'less:compile',
		// Minification des .css
		'newer:cssmin:target',
		// Construction du fichier index.html final
		'htmlbuild:prod',
		// Renommage du fichier généré
		'rename:generateIndexFile',
		// Copie des fichiers dans le répertoire de destination
		'copy:main',
		// Effacement du répertoire de génération
		'clean:generateDir'
	]);

	// Tâche plus rapide
	// A utiliser pour les compilations plus souvent
	grunt.registerTask("gendist", [
		// Effacement du répertoire de génération s'il existe
		'clean:generateDir',
		// Effacement du répertoire de destination
		'clean:destinationDir',
		// Concaténation des templates AngularJS dans un fichier .js
		'ngtemplates:webApp',
		// Minification des .js + le template.js
		'newer:uglify:target',
		// Concaténation
		'concat:libraries',
		// Compilation des .less en .css
		'less:compile',
		// Minification des .css
		'newer:cssmin:target',
		// Construction du fichier index.html final
		'htmlbuild:prod',
		// Renommage du fichier généré
		'rename:generateIndexFile',
		// Copie des fichiers dans le répertoire de destination
		'copy:main',
		// Effacement du répertoire de génération
		'clean:generateDir'
	]);

	// Tâche plus rapide
	// A utiliser pour les compilations pour debug (remplacement du uglify par concat)
	grunt.registerTask("gendbg", [
		// Effacement du répertoire de génération s'il existe
		'clean:generateDir',
		// Effacement du répertoire de destination
		'clean:destinationDir',
		// Concaténation des templates AngularJS dans un fichier .js
		'ngtemplates:webApp',
		// Concaténation des fichiers js
		'concat:debug',
		// Compilation des .less en .css
		'less:compile',
		// Minification des .css
		'newer:cssmin:target',
		// Construction du fichier index.html final
		'htmlbuild:prod',
		// Renommage du fichier généré
		'rename:generateIndexFile',
		// Copie des fichiers dans le répertoire de destination
		'copy:main',
		// Effacement du répertoire de génération
		'clean:generateDir'
	]);
};
