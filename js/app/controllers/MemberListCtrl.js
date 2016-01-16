/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("MemberListCtrl", ['$scope', '$stateParams',  'MembersService', function ($scope, $stateParams,  MembersService) {

	$scope.idClub = $stateParams.idClub;

	$scope.displayViewAfter('/clubs/' + $stateParams.idClub + '/members', function (data) {
		$scope.members = MembersService.initData(data);
		$scope.nbact = MembersService.getNbAct(data);
	});

	$scope.displayedMembers = [];
	$scope.itemsByPage = 12;
}]);
