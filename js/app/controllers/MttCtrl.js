/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, $:false, _:false, moment:false, console:false*/
/* ------------------------- */

webApp.controller("MttCtrl", ["$scope", 'MpcAPIService', '$stateParams', '$location', '$filter', '$q', '$http',   function ($scope, MpcAPIService, $stateParams, $location, $filter, $q, $http) {

	$scope.idClub = $stateParams.idClub;
	$scope.nummtt = $stateParams.id;

	if ($stateParams.id === '0') {
		$scope.edit = true;
		$scope.mttMembers = [];
		$scope.mttRankings = [];
		$scope.mtt = [];
		$scope.mtt.hremtt = new Date();

	} else {
		$scope.edit = false;
		$scope.displayViewAfter('/clubs/' + $stateParams.idClub + '/mtts/' + $stateParams.id, function (data) {

			$scope.dtemttformat = moment(data.dtemtt).format('dddd DD/MM/YYYY à HH:mm');

			data.hremtt = new Date(data.dtemtt);
			data.dtemtt = $scope.convertDate(data.dtemtt);
			$scope.data = data;

			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/mtts/' + $stateParams.id + '/members', null, 'GET', function (data) {
				$scope.mttMembers = data;
			});
			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/mtts/' + $stateParams.id + '/rankings', null, 'GET', function (data) {
				$scope.mttRankings = _.each(data, function (element) {
					element.text = element.nomrnk;
				});
			});
		});
	}

    // Récupérer la liste des classements pour les ajouter quand on créé un nouveau Mtt ou on en modifie un
    MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankingsprogress', null, 'GET', function (data) {
		$scope.rankings = _.each(data, function (element) {
			element.text = element.nomrnk;
		});
	});

    // Ramener les membres actifs du club pour les saisir dans le classement
    MpcAPIService.http('/clubs/' + $stateParams.idClub + '/membersactive', null, 'GET', function (data) {
		$scope.members = _.sortByOrder(data, ['psdmbr'], [true]);
	});

	$scope.editMtt = function () {

		$scope.mtt.dtemtt = $scope.data.dtemtt;
		$scope.mtt.hremtt = $scope.data.hremtt;

		$scope.mtt.buymtt = $scope.data.buymtt;
		$scope.mtt.paymtt = $scope.data.paymtt;
		$scope.mtt.guamtt = $scope.data.guamtt;
		$scope.mtt.fixmtt = $scope.data.fixmtt;
		$scope.mtt.plymtt = $scope.data.plymtt;
		$scope.mtt.kilmtt = $scope.data.kilmtt;

		$scope.edit = true;
	};

	$scope.calcPtstMtt = function () {
		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/mtts/' + $scope.nummtt + '/points', null, 'GET', function (data) {
			// Rechargement de la page
			$scope.reloadPage();
		}, function (data) {
			console.log("Erreur");
		});
	};

	//+ Mise à jour des classements associés
	$scope.calcPtstRankings = function () {
		_.each($scope.mttRankings, function (element) {
			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/rankings/' + element.numrnk + '/points', null, 'GET', function (data) {
			}, function (data) {
				console.log("Erreur");
			});
		});
	};

	// Ajout d'un MTT
    $scope.addMtt = function () {

		var paymtt = $scope.mtt.paymtt,
			guamtt = $scope.mtt.guamtt,
			fixmtt = $scope.mtt.fixmtt,
			plymtt = $scope.mtt.plymtt,
			kilmtt = $scope.mtt.kilmtt;

		if (!paymtt) {
			paymtt = 0;
		}

		if (!guamtt) {
			guamtt = 0;
		}

		if (!fixmtt) {
			fixmtt = 0;
		}

		if (!plymtt) {
			plymtt = 0;
		}

		if (!kilmtt) {
			kilmtt = 0;
		}

		if (!$scope.mtt.hremtt) {
			$scope.mtt.hremtt = new Date();
		}
		//$scope.mtt.dtemtt.setHours($scope.mtt.hremtt);

		var start_hour = {
            hour: new Date($scope.mtt.hremtt).getHours(), /*- ($scope.mtt.hremtt.getTimezoneOffset() / 60)*/
            min: new Date($scope.mtt.hremtt).getMinutes()
        };
		console.log('start_hour', start_hour);

		console.log('$scope.mtt.dtemtt', $scope.mtt.dtemtt.toString().indexOf('/'));

		if($scope.mtt.dtemtt.toString().indexOf('/') === -1) {
			var dte = $scope.mtt.dtemtt;
		} else {
			var dtemttSplit = $scope.mtt.dtemtt.split("/");
			var dte = new Date(dtemttSplit[2], dtemttSplit[1] - 1, dtemttSplit[0]);
		}

		var mtt = {
			clbmtt : $stateParams.idClub,
			dtemtt : dte,
			buymtt : $scope.mtt.buymtt,
			paymtt : paymtt,
			guamtt : guamtt,
			fixmtt : fixmtt,
			plymtt : plymtt,
			kilmtt : kilmtt,
			members : $scope.mttMembers,
			rankings : $scope.mttRankings
		};

		console.log('DTE',mtt.dtemtt);

		mtt.dtemtt.setHours(start_hour.hour);
		mtt.dtemtt.setUTCHours(start_hour.hour);
		mtt.dtemtt.setMinutes(start_hour.min);
		//mtt.dtemtt.setUTCDate($scope.mtt.dtemtt);

		console.log('DTE',mtt.dtemtt);
		console.log('MTT',mtt);

		if ($stateParams.id === '0') {
			if (JSON.stringify($scope.mtt.$error) === '{}') {
				MpcAPIService.http('/clubs/' + $stateParams.idClub + '/mtts', mtt, 'POST', function (data) {
					$scope.nummtt = data.nummtt;

					//+ On raffraichit l'affichage mais bon il faut mieu gérer cela car on aura des
					// PB si tout n'est pas fini d'insérer
					$location.path('/club/' + $stateParams.idClub +'/mtts/' + $scope.nummtt);
				}, function (data) {
					console.log("Erreur");
				});
			}
		} else {
			MpcAPIService.http('/clubs/' + $stateParams.idClub + '/mtts/' + $scope.nummtt, mtt, 'PUT', function (data) {

				// Rechargement de la page
				$scope.reloadPage();
			}, function (data) {
				console.log("Erreur");
			});
			// Rechargement de la page
			$scope.reloadPage();
		}
	};

	// Suppression d'un MTT
    $scope.deleteMtt = function () {
		//+ Supprimer un MTT
		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/mtts/' + $stateParams.id , null, 'DELETE', function (data) {
			$location.path('/club/' + $stateParams.idClub + '/mtts');
		});

	};

	$scope.addMttMember = function () {
		var member = {
			plcmtm : $scope.mttMembers.length + 1,
			psdmbr : '',
			psdmbe : '',
			nbkill : 0,
			ptsmtm : 0,
			mbrmtm : 0
		};
		$scope.mttMembers.push(member);
	};

	$scope.deleteMttMember = function (plcmbr, $event) {
		$event.stopImmediatePropagation();

		$scope.mttMembers = _.each($scope.mttMembers, function (element) {
			if(element.plcmtm === plcmbr) {
				element.plcmtm = 0;
			}
		});
		$scope.mttMembers = _.each($scope.mttMembers, function (element) {
			if(element.plcmtm > plcmbr) {
				element.plcmtm = element.plcmtm - 1;
			}
		});

		$scope.mttMembers = $scope.mttMembers.filter(function (obj) {
			return obj.plcmtm !== 0;
		});
	};

	$scope.cancelEdit = function () {
		if ($stateParams.id === '0') {
			console.log($stateParams.id);
			$location.path('/club/' + $stateParams.idClub);
		} else {
			// Rechargement de la page
			$scope.reloadPage();
		}
	};

	$scope.loadTags = function (query) {
		// return $scope.rankings;

		var deferred = $q.defer();
		deferred.resolve($filter('filter')($scope.rankings, query));
		return deferred.promise;
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

	$scope.showContent = function($fileContent) {
        $scope.content = $fileContent;
    };

	$scope.importFile = function()
	{
		MpcAPIService.http('/clubs/' + $stateParams.idClub + '/mtts/import' , $scope.content, 'POST', function (data) {
			console.log("success", data);
			$scope.mttMembers = data;

		}, function (data) {
			console.log("Erreur");
		});
	}

}]);
