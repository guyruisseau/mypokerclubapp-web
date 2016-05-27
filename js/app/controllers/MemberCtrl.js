/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false, console:false*/
/* ------------------------- */

webApp.controller("MemberCtrl", ["$scope", 'MpcAPIService', '$stateParams', '$location', '$q', '$cookieStore', 'MemberService', 'MttListService', function ($scope, MpcAPIService, $stateParams, $location, $q, $cookieStore, MemberService, MttListService) {

	$scope.user = $cookieStore.get('userInfo');

	console.log($scope.user);

	$scope.idClub = $stateParams.idClub;
	$scope.edit = false;

	if ($stateParams.id === '0') {
		$scope.edit = true;

	} else {
		$scope.displayViewAfter('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id, function (data) {
			console.log(data.dtnmbr);
			data.dtnmbr = $scope.convertDate(data.dtnmbr);
			console.log(data.dtnmbr);
			$scope.data = data;

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/rankings', null, 'GET', function (data) {
				$scope.memberRankings = MemberService.initDataRankings(data);
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/parties', null, 'GET', function (data) {
				$scope.memberParties = MemberService.initDataParties(data);
			});

						MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/sharks', null, 'GET', function (data) {
				$scope.memberSharks = data;
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/shark', null, 'GET', function (data) {
				$scope.memberShark = data;
			});

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/fishs', null, 'GET', function (data) {
				$scope.memberFishs = data;
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

	// Lien entre un user et un membre
	$scope.linkMbr = function () {
		console.log('link');

		$scope.data.usrmbr = $scope.user.numusr;

		console.log('user', $scope.user);
		console.log('member', $scope.data);

		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/members/' + $stateParams.id + '/link', $scope.data, 'PUT', function (data) {

			$scope.user.nummbr = $stateParams.id;
			$scope.user.usvmbr = 'I';

			$cookieStore.put('userInfo', $scope.user);

			// Rechargement de la page
			$scope.reloadPage();
		}, function (data) {
				console.log("Erreur", data);
		});
	}

    // Ajout d'un membre
    $scope.addMbr = function () {
		console.log($scope.member.dtnmbr);

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
			stambc = $scope.member.stambc,
			mbr = {};

        if (!nommbr) {
			nommbr = null;
        }

		if (!prnmbr) {
			prnmbr = null;
        }

		if (!dtnmbr) {
			dtnmbr = null;
        } else {
			if ($scope.member.dtnmbr.toString().indexOf('/') === -1) {
				dtnmbr = $scope.member.dtnmbr;
			} else {
				var dtnmbrSplit = $scope.member.dtnmbr.split("/");
				dtnmbr = new Date(dtnmbrSplit[2], dtnmbrSplit[1] - 1, dtnmbrSplit[0]);
			}
			dtnmbr = dtnmbr.getUTCFullYear() + '-' + (dtnmbr.getUTCMonth() + 1) +  '-' + dtnmbr.getDate();
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

		mbr = {
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
					$location.path('/club/' + $stateParams.idClub + '/members/' + data.nummbr);
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

	//+ Datepicker
	$scope.today = function () {
		$scope.dt = new Date();
        return $scope.dt;
    };

    //$scope.today();
    $scope.showWeeks = true;
	$scope.dte = null;
    $scope.toggleWeeks = function () {
		return $scope.showWeeks = !$scope.showWeeks;
    };

	$scope.clear = function() {
    	return $scope.dte = null;
    };

    $scope.toggleMin = function () {
        var _ref;
        return $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
          "null": new Date()
        };
    };

	$scope.toggleMin();

	$scope.open = function ($event) {
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
