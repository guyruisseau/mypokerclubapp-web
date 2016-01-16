/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, $:false, _:false*/
/* ------------------------- */

webApp.controller('MainCtrl', ['$scope', '$state', '$stateParams', 'MpcAPIService', 'MpcAPIAuth', 'MpcLoginService', '$cookies', '$location', '$cookieStore', 'ngDialog', function ($scope, $state, $stateParams, MpcAPIService, MpcAPIAuth, MpcLoginService, $cookies, $location, $cookieStore, ngDialog) {
	$scope.global = {
		version: '0.0.0 beta'
	};
	$scope.pageLoaded = false;

	$scope.subMenu = false;
	$scope.activeSubMenu = function () {
		console.log("activeSubMenu");
		$scope.subMenu = !$scope.subMenu;
	};


	$scope.unActiveSubMenu = function () {
		$scope.subMenu = false;
	};

	// Sur le clic on ferme le menu
	$('#menu-component .menu-item').on('click', function () {
		console.log('click menu');
		$('#menu-component').collapse('hide');
	});

	// Sur le clic on ferme le sous-menu
	$('#submenu-club .menu-item').on('click', function () {
		console.log('click sous menu');
		$scope.subMenu = false;
		$('#submenu-club').collapse('hide');
	});

	// TODO Faire un ClubService avec une méthode qui initialise
	$scope.currentClub = {
		id : localStorage.getItem('currentIdClub') || "",
		name : localStorage.getItem('currentNameClub') || ""
	};

	$scope.manageAccount = function () {
		if ($scope.isLogged()) {
			$state.go('account.home');
		} else {
			$state.go('login');
		}
	};

	$scope.reloadPage = function () {
		$state.transitionTo($state.current, $stateParams, {
			reload: true,
			inherit: false,
			notify: true
		});
	};

	$scope.isLogin = function () {
		return MpcLoginService.isLogin();
	};

	console.log($scope.isLogin());

	$scope.selectClub = function (idClub, nomClub) {
		$scope.currentClub = {
			id: idClub,
			name: nomClub
		};
		//$scope.currentClub.name = nomClub;

		//+ TODO Utiliser ClubService
		localStorage.setItem('currentIdClub', idClub);
		localStorage.setItem('currentNameClub', nomClub);

		MpcAPIService.http('/clubs/' + idClub, null, 'GET', function (data) {
			//callback(data);
			$scope.loadingPage = false;
			$scope.pageLoaded = true;

			$location.path('/club/' + idClub);
		});
	};

	$scope.isLogged = function () {
		return MpcAPIAuth.isAuthenticated();
	};

	$scope.path = function () {
		var i, path, args = [].slice.call(arguments);
		return '/' + args.join('/');
	};

	$scope.displayViewAfter = function (apiCall, callback) {
		$scope.loadingPage = true;
		/*if (_.isFunction(apiCall)) {
			callback = apiCall;
			if (!$scope.pageLoaded) {
				apiCall = '/retrieve';
			} else {
				callback();
				$scope.loadingPage = false;
				return;
			}
		} else {

			if (!$scope.pageLoaded) {
				if (apiCall.indexOf('?') !== -1) {
					apiCall += '&';
				} else {
					apiCall += '?';
				}

				apiCall += 'retrieveSession=true';
			}
		}*/
		MpcAPIService.http(apiCall, null, 'GET', function (data) {
			callback(data);
			$scope.loadingPage = false;
			$scope.pageLoaded = true;
		}, function () {
			$scope.loadingPage = false;
		});
	};

	$scope.showRnk = function (numclb, numrnk) {
		$location.path('/club/' + numclb + '/rankings/' + numrnk);
	};

	$scope.showMtt = function (numclb, nummtt) {
		$location.path('/club/' + numclb + '/mtts/' + nummtt);
	};

	$scope.showMember = function (numclb, nummbr, edit, $event) {

		if (!edit) {
			$location.path('/club/' + numclb + '/members/' + nummbr);
		}
	};

	$scope.newRnk = function (numclb) {
		$location.path('/club/' + numclb + '/rankings/0');
	};

	$scope.newMtt = function (numclb) {
		$location.path('/club/' + numclb + '/mtts/0');
	};

	$scope.newMember = function (numclb) {
		$location.path('/club/' + numclb + '/members/0');
	};

	// Ouvre la popup de connexion
	$scope.openContactForm = function () {
		ngDialog.openConfirm({template: 'templates/login.html',
		  scope: $scope //Pass the scope object if you need to access in the template
		}).then(
			function (value) {
				//save the contact form
			},
			function (value) {
				//Cancel or do nothing
			}
		);
	};

	/**
     * SOCIAL LOGIN
     * Facebook and Google
     */
    // FB Login
    $scope.fbLogin = function (scope) {
		MpcLoginService.fbLogin(scope);
    };
    // END FB Login

	$scope.gplusLogin = function (scope) {
		MpcLoginService.gplusLogin(scope);
	};

	// Logout user
    $scope.logout = function () {
		MpcLoginService.logout();
    };

	$scope.convertDate = function (inputFormat) {
	  function pad(s) { return (s < 10) ? '0' + s : s; }
	  var d = new Date(inputFormat);
	  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
	};
}]);
