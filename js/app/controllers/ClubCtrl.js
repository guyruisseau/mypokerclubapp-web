/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("ClubCtrl", ["$scope", '$stateParams', function ($scope, $stateParams) {
	$scope.idClub =  $stateParams.idClub;

	//+ TODO Faire un truc qui est lancé sur chaque contrôleurs
	//+ Une méthode genre initContrôleurs();
	if($scope.currentClub.name === '')
	{
		$scope.selectClub($stateParams.idClub)
	}

	$scope.displayViewAfter('/clubs/' + $stateParams.idClub, function (data) {
		$scope.data = data;
	});
}]);
