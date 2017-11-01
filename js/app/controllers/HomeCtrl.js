/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("HomeCtrl", ["$scope", 'MpcAPIService', '$location', 'HelloAuth', function ($scope, MpcAPIService, $location, HelloAuth) {
	$scope.displayViewAfter('/clubs', function (data) {
		$scope.clubList = data;
		console.log('DATA GRI', data);
	});

  /**
  * Fonction de création d'un nouveau club
  */
  $scope.addClb = function () {
    if($scope.clb.nomclb !== '' && $scope.clb.prfclb !== '') {
      MpcAPIService.http('/clubs' , $scope.clb, 'POST', function (data) {
        //+ On raffraichit l'affichage mais bon il faut mieu gérer cela car on aura des
        // PB si tout n'est pas fini d'insérer
        HelloAuth.setUser(data.user);
        $location.path('/club/' + data.clb.numclb);
      }, function (data) {
        console.log("Erreur");
      });
    }
  }
}]);
