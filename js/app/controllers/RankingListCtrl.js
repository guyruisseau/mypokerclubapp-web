/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("RankingListCtrl", ['$scope', '$location', '$stateParams', 'RankingsService', function ($scope, $location, $stateParams, RankingsService) {
	$scope.idClub = $stateParams.idClub;
	$scope.displayViewAfter('/clubs/' + $stateParams.idClub + '/rankings', function (data) {
		$scope.rankingList = RankingsService.initDataRankings(data);
	});

	$scope.displayedRankingList = [];

}]);
