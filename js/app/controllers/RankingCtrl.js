/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("RankingCtrl", ["$scope", '$location', 'RankingService', 'MpcAPIService', '$stateParams', function ($scope, $location, RankingService, MpcAPIService, $stateParams) {

	$scope.idClub = $stateParams.idClub;

    //+ Si l'id vaut 0 on créé un nouveau record
    if ($stateParams.id === '0') {
		$scope.edit = true;
	} else {
        $scope.edit = false;
        $scope.displayViewAfter('/clubs/' + $stateParams.idClub + '/rankings/' + $stateParams.id, function (data) {
            $scope.data = RankingService.initData(data);

            MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankings/' + $stateParams.id + '/members', null, 'GET', function (data) {
                $scope.rankingMembers = RankingService.initDataMembers(data);
            });

            MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankings/' + $stateParams.id + '/parties', null, 'GET', function (data) {
                $scope.rankingParties = RankingService.initDataParties(data);
            });

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankings/' + $stateParams.id + '/killer', null, 'GET', function (data) {
                $scope.rankingKillers = RankingService.initDataMembers(data);
            });

        });
    }

	$scope.displayedMembers = [];
	$scope.displayedRankingParties = [];
	$scope.itemsByPageMember = 10;


    $scope.editRnk = function () {

		$scope.rnk.nomrnk = $scope.data.nomrnk;
		$scope.rnk.strrnk = $scope.data.strrnk;
		$scope.rnk.endrnk = $scope.data.endrnk;
		$scope.rnk.bkrrnk = $scope.data.bkrrnk;
		$scope.rnk.minrnk = $scope.data.minrnk;
		$scope.rnk.resrnk = $scope.data.resrnk;

		$scope.edit = true;
	};

    $scope.addRnk = function () {
        var nomrnk = $scope.rnk.nomrnk,
            strrnk = $scope.rnk.strrnk,
            endrnk = $scope.rnk.endrnk,
            bkrrnk = $scope.rnk.bkrrnk,
            minrnk = $scope.rnk.minrnk,
            resrnk = $scope.rnk.resrnk;

        if (!bkrrnk) {
			bkrrnk = 0;
		}
        if (!minrnk) {
			minrnk = 0;
		}
        if (!resrnk) {
			resrnk = 0;
		}

        var rnk = {
            nomrnk : nomrnk,
            strrnk : strrnk,
            endrnk : endrnk,
            bkrrnk : bkrrnk,
            minrnk : minrnk,
            resrnk : resrnk
        };

        //+ Si pas d'erreurs dans le formulaire
        if (JSON.stringify($scope.rnk.$error) === '{}') {
            if ($stateParams.id === '0') {
                MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankings', rnk, 'POST', function (data) {

					$scope.numrnk = data.numrnk;

					//+ On raffraichit l'affichage mais bon il faut mieu gérer cela car on aura des
					// PB si tout n'est pas fini d'insérer
					$location.path('/rankings/' + $scope.numrnk);
				}, function (data) {
					console.log("Erreur");
				});
            } else {
                MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankings/' + $stateParams.id, rnk, 'PUT', function (data) {
                    // Rechargement de la page
                    $scope.reloadPage();
                }, function (data) {
					console.log("Erreur");
				});
            }
        }
    };
}]);
