/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false, Holder:false*/
/* ------------------------- */

webApp.directive('menuclub', function () {
	return {
        restrict: 'E',
		/*template: '<h1>CECI est une directive</h1>'*/
		templateUrl:'templates/menu-club.html'
    };
});
