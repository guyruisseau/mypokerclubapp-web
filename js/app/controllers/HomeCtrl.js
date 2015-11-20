/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("HomeCtrl", ["$scope", function ($scope) {
	$scope.displayViewAfter('/clubs', function (data) {
		$scope.clubList = data;
		console.log('DATA GRI', data);
	});

}]);
