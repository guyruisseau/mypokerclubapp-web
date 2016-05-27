/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("AdminClubCtrl", ["$scope", '$stateParams', 'MpcAPIService', function ($scope, $stateParams, MpcAPIService) {
	$scope.idClub =  $stateParams.idClub;

	$scope.displayViewAfter('/clubs/' + $stateParams.idClub, function (data) {
		$scope.data = data;

		// Ramener les membres a lier avec un utilisateur Fabebook
		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/membersvalidate', null, 'GET', function (data) {

			$scope.mbrList = _.sortByOrder(data, ['psdmbr'], [true]);
			$scope.displayedMbrList = [];
		});

		// Ramener les membres a lier avec un utilisateur Fabebook
		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/dru', null, 'GET', function (data) {
			$scope.druList = data;
			$scope.displayedDruList = [];
			console.log($scope.druList);
		});
	});

	$scope.acceptLink = function (nummbr) {
		console.log('accept', nummbr);

		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + nummbr + '/linkaccept', nummbr, 'PUT', function (data) {
			// Rechargement de la page
			$scope.reloadPage();
		}, function (data) {
			console.log("Erreur", data);
		});
	}

	$scope.refuseLink = function (nummbr) {
		console.log('refuse', nummbr);
		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + nummbr + '/linkrefuse', nummbr, 'PUT', function (data) {
			// Rechargement de la page
			$scope.reloadPage();
		}, function (data) {
			console.log("Erreur");
		});
	}

	//+ Mise à jour des droits utilisateurs des membres
	$scope.updateDru = function (dru) {
		console.log('Upd DRU', dru);

		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/dru/'+ dru.usrdru , dru, 'PUT', function (data) {
			// Rechargement de la page
			$scope.reloadPage();
		}, function (data) {
			console.log("Erreur", data);
		});
	}
}]);
