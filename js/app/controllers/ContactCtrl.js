/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false, console:false*/
/* ------------------------- */

webApp.controller("ContactCtrl", ["$scope", '$stateParams', 'MpcAPIService', '$location', function ($scope, $stateParams, MpcAPIService, $location) {
	// Ajout d'un contact
    $scope.addContact = function () {

		// Si un des 3 éléments est null on ne fait rien
		if (!$scope.contactMsg.mail || !$scope.contactMsg.obj || !$scope.contactMsg.msg) {
			return;
		}

		console.log($scope.contactMsg);
		var cnt = {
			melcnt : $scope.contactMsg.mail,
			objcnt : $scope.contactMsg.obj,
			msgcnt : $scope.contactMsg.msg
		};

		MpcAPIService.http('/contact', cnt, 'POST', function (data) {
			// Rechargement de la page
			$location.path('/home');
		}, function (data) {
			console.log("Erreur", data);
		});
	};
}]);
