/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("MemberCtrl", ["$scope", 'MpcAPIService', '$stateParams', '$location', 'MemberService', 'MttListService',  function ($scope, MpcAPIService, $stateParams, $location, MemberService, MttListService) {

	$scope.idClub = $stateParams.idClub;
	$scope.edit = false;

	if ($stateParams.id === '0') {
		$scope.edit = true;

	} else {
		$scope.displayViewAfter('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id, function (data) {
			$scope.data = data;

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/rankings', null, 'GET', function (data) {
				$scope.memberRankings = MemberService.initDataRankings(data);
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/parties', null, 'GET', function (data) {
				$scope.memberParties = MemberService.initDataParties(data);
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/shark', null, 'GET', function (data) {
				$scope.memberShark = data;
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/fish', null, 'GET', function (data) {
				$scope.memberFish = data;
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/awardsrankings', null, 'GET', function (data) {
				$scope.memberAwardsRankings = data;
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/awardsmtts', null, 'GET', function (data) {
				$scope.memberAwardsMtts = MttListService.initData(data);
			});

			$scope.displayedMemberParties = [];
		});
	}
    // Ajout d'un membre
    $scope.addMbr = function () {
        var psdmbr = $scope.member.psdmbr,
            nommbr = $scope.member.nommbr,
            prnmbr = $scope.member.prnmbr,
            dtnmbr = $scope.member.dtnmbr,
            adrmbr = $scope.member.adrmbr,
            copmbr = $scope.member.copmbr,
            vilmbr = $scope.member.vilmbr,
			telmbr = $scope.member.telmbr,
			mobmbr = $scope.member.mobmbr,
			melmbr = $scope.member.melmbr,
			stambc = $scope.member.stambc;

        if (!nommbr) {
			nommbr = null;
        }

		if (!prnmbr) {
			prnmbr = null;
        }

		if (!dtnmbr) {
			dtnmbr = null;
        }

		if (!adrmbr) {
			adrmbr = null;
        }

		if (!copmbr) {
			copmbr = null;
        }

		if (!vilmbr) {
			vilmbr = null;
        }

		if (!telmbr) {
			telmbr = null;
        }

		if (!mobmbr) {
			mobmbr = null;
        }

		if (!melmbr) {
			melmbr = null;
        }

		if (!stambc) {
			stambc = 'A';
        }

		var mbr = {
			clbmbr : $stateParams.idClub,
			psdmbr : psdmbr,
			usrmbr : null,
			nommbr : nommbr,
			prnmbr : prnmbr,
			dtnmbr : dtnmbr,
			adrmbr : adrmbr,
			copmbr : copmbr,
			vilmbr : vilmbr,
			telmbr : telmbr,
			mobmbr : mobmbr,
			melmbr : melmbr,
			stambc : stambc,
			keymbr : null
		};
        if (JSON.stringify($scope.member.$error) === '{}') {
			if ($stateParams.id === '0') {
				MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members', mbr, 'POST', function (data) {
					// Rechargement de la page
					$location.path('/club/' + $stateParams.idClub +'/members/' + data.nummbr);
				}, function (data) {
					console.log("Erreur", data);
				});
			} else {
				MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id, mbr, 'PUT', function (data) {
					// Rechargement de la page
					$scope.reloadPage();
				}, function (data) {
					console.log("Erreur", data);
				});
			}
		}
    };

	$scope.editMbr = function () {
		$scope.member.psdmbr = $scope.data.psdmbr;
        $scope.member.nommbr = $scope.data.nommbr;
		$scope.member.prnmbr = $scope.data.prnmbr;
        $scope.member.dtnmbr = $scope.data.dtnmbr;
        $scope.member.adrmbr = $scope.data.adrmbr;
        $scope.member.copmbr = $scope.data.copmbr;
		$scope.member.vilmbr = $scope.data.vilmbr;
		$scope.member.telmbr = $scope.data.telmbr;
		$scope.member.mobmbr = $scope.data.mobmbr;
		$scope.member.melmbr = $scope.data.melmbr;
		$scope.member.stambc = $scope.data.stambc;

		$scope.edit = true;
	};
}]);
