/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("ClubCtrl", ["$scope", '$stateParams', function ($scope, $stateParams) {
	$scope.idClub =  $stateParams.idClub;
	$scope.displayViewAfter('/clubs/' + $stateParams.idClub , function (data) {
		$scope.data = data;
	});
}]);
