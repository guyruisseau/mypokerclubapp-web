/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("ClubCtrl", ["$scope", '$stateParams', 'MpcAPIService', function ($scope, $stateParams, MpcAPIService) {
	$scope.idClub =  $stateParams.idClub;

	//+ TODO Faire un truc qui est lancé sur chaque contrôleurs
	//+ Une méthode genre initContrôleurs();
	/*if($scope.currentClub.name === '')
	{
		$scope.selectClub($stateParams.idClub);
	}*/

	$scope.selectClub($stateParams.idClub);

	$scope.displayViewAfter('/clubs/' + $stateParams.idClub, function (data) {
		$scope.data = data;
	});
}]);
