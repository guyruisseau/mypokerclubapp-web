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
		$scope.rnk.starnk = $scope.data.starnk;

		$scope.edit = true;
	};

    $scope.addRnk = function () {
        var nomrnk = $scope.rnk.nomrnk,
            strrnk = $scope.rnk.strrnk,
            endrnk = $scope.rnk.endrnk,
            bkrrnk = $scope.rnk.bkrrnk,
            minrnk = $scope.rnk.minrnk,
            resrnk = $scope.rnk.resrnk,
			starnk = $scope.rnk.starnk;

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
            resrnk : resrnk,
			starnk : starnk
        };

        //+ Si pas d'erreurs dans le formulaire
        if (JSON.stringify($scope.rnk.$error) === '{}') {
            if ($stateParams.id === '0') {
                MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankings', rnk, 'POST', function (data) {

					$scope.numrnk = data.numrnk;

					//+ On raffraichit l'affichage mais bon il faut mieu gérer cela car on aura des
					// PB si tout n'est pas fini d'insérer
					$location.path('/club/' + $stateParams.idClub + '/rankings/' + $scope.numrnk);
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

	//+ Datepicker
	$scope.today = function() {
        return $scope.dt = new Date();
    };

    //$scope.today();
    $scope.showWeeks = true;
	$scope.dte = null;
    $scope.toggleWeeks = function() {
    	return $scope.showWeeks = !$scope.showWeeks;
    };

	$scope.clear = function() {
    	return $scope.dte = null;
    };

    $scope.toggleMin = function() {
        var _ref;
        return $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
          "null": new Date()
        };
    };

	$scope.toggleMin();

	$scope.openStr = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        console.log('..');
        return $scope.openedStr = true;
    };

	$scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        console.log('..');
        return $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
		'close-text': 'Fermer'
    };

	$scope.datepickerPopupConfig = {
		'close-text': 'Fermer'
	};

    $scope.format = 'dd/MM/yyyy';
}]);
