/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, angular:false, _:false, moment:false*/
/* ------------------------- */


/* ---------------------------------------------- */
/* Déclaration/Initialisation du module angularjs */
/* ---------------------------------------------- */
var webApp = angular.module('mpc.webApp', ['mpc.api', 'mpc.login', 'ui.router', 'ngCookies', 'smart-table', 'ui.bootstrap', 'ngDialog', 'ngTagsInput', 'ngLocale']);

webApp.config(['$stateProvider', '$urlRouterProvider', '$logProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $logProvider, $locationProvider) {
	// Gestion de la redirection si page non trouvée
	//+ TODO
	$urlRouterProvider.otherwise("/");
	//$urlRouterProvider.otherwise("/error");

	// Gestion du log
	$logProvider.debugEnabled(true);
	// Activation du mode html5
	//$locationProvider.html5Mode(true);

	// Liste des routes
	$stateProvider
		// Page d'accueil
		.state('home', {
			url: '/',
			templateUrl: 'templates/home.html',
			controller: 'HomeCtrl'
		})
		// Page du club
		.state('club', {
			url: '/club/{idClub}',
			templateUrl: '/templates/club.html',
			controller: 'ClubCtrl'
		})
		// Page de la liste des membres
		.state('members', {
			url: '/club/{idClub}/members',
			templateUrl: '/templates/members-list.html',
			controller: 'MemberListCtrl'
		})
		// Page d'un membre
		.state('member', {
			url: '/club/{idClub}/members/{id}',
			templateUrl: 'templates/member.html',
			controller: 'MemberCtrl'
		})
		// Page des classements
		.state('rankings', {
			url: '/club/{idClub}/rankings',
			templateUrl: '/templates/rankings-list.html',
			controller: 'RankingListCtrl'
		})
		// Page d'un classement
		.state('ranking', {
			url: '/club/{idClub}/rankings/{id}',
			templateUrl: '/templates/ranking.html',
			controller: 'RankingCtrl'
		})
		// Page dse Mtts
		.state('mtts', {
			url: '/club/{idClub}/mtts',
			templateUrl: '/templates/mtt-list.html',
			controller: 'MttListCtrl'
		})
		// Page d'un MTT
		.state('mtt', {
			url: '/club/{idClub}/mtts/{id}',
			templateUrl: '/templates/mtt.html',
			controller: 'MttCtrl'
		})
		// Page d'un MTT
		.state('newmtt', {
			url: '/club/{idClub}/mtts/0/new',
			templateUrl: '/templates/mtt-new.html',
			controller: 'NewMttCtrl'
		})
		// Page des CGs
		.state('cgs', {
			url: '/club/{idClub}/gc',
			templateUrl: '/templates/cg-list.html',
			controller: 'CgListCtrl'
		})
		// Page d'un CG
		.state('cg', {
			url: '/club/{idClub}/cg/{id}',
			templateUrl: '/templates/cg.html',
			controller: 'CgCtrl'
		})
		// Page d'erreur
		.state('error', {
			url: '/error',
			templateUrl: 'templates/error.html',
			controller: 'ErrorCtrl'
		})
		// Page d'un login
		.state('login', {
			url: '/login',
			templateUrl: '/templates/connected.html',
			controller: 'LoginCtrl'
		});
}]);
