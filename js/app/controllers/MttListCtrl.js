/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("MttListCtrl", ['$scope', '$stateParams', 'MttListService',  function ($scope, $stateParams, MttListService) {

	$scope.idClub = $stateParams.idClub;

	$scope.displayViewAfter('/clubs/' + $stateParams.idClub + '/mtts', function (data) {
		$scope.mttList = MttListService.initData(data);
		$scope.displayedMttList = [];
	});
}]);
