/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, $:false, _:false, console:false */
/* ------------------------- */

webApp.controller('MainCtrl', ['$scope', '$state', '$stateParams', 'MpcAPIService', 'MpcAPIAuth', 'HelloAuth', 'MpcLoginService', '$cookies', '$location', 'ngDialog', function ($scope, $state, $stateParams, MpcAPIService, MpcAPIAuth, HelloAuth, MpcLoginService, $cookies, $location, ngDialog) {
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
		//return MpcLoginService.isLogin();
		return HelloAuth.isLogged();
	};

	$scope.isAdminClub = function () {
		//return MpcLoginService.isAdminClub($scope.currentClub.id);
		return HelloAuth.isAdminClub($scope.currentClub.id);
	};

	$scope.isThisMember = function (idMember) {
		//return MpcLoginService.isThisMember(idMember);
		return HelloAuth.isAdminClub($scope.currentClub.id);
	};


	$scope.selectClub = function (idClub) {

		MpcAPIService.http('/clubs/' + idClub, null, 'GET', function (data) {
			//callback(data);

			$scope.currentClub = {
				id: data.numclb,
				name: data.nomclb
			};

			//+ TODO Utiliser ClubService
			localStorage.setItem('currentIdClub', data.numclb);
			localStorage.setItem('currentNameClub', data.nomclb);

			$scope.loadingPage = false;
			$scope.pageLoaded = true;

			$location.path('/club/' + idClub);
		});
	};

	$scope.helloLogin = function (type, scope) {
		HelloAuth.login(type).then(function (json) {
			console.log(json);
			HelloAuth.getUserInfos().then(function (data) {
				console.log('test', data);
				$state.go('login');
				scope.closeThisDialog();
			}, function (error) {
				console.log(error);
			});
		}, function (error) {
            console.log(error);
		});
    };
	$scope.helloLogout = function (type) {
		HelloAuth.logout(type).then(function (json) {
			console.log(json);
			$state.go('home');
		}, function (error) {
            console.log(error);
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
		ngDialog.openConfirm({
			template: 'templates/login.html',
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

	// Logout user
    $scope.logout = function () {
		MpcLoginService.logout();
    };

	$scope.convertDate = function (inputFormat) {
		var d = new Date(inputFormat);
		function pad(s) {return (s < 10) ? '0' + s : s; }
		return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
	};


    // When callback is received, we need to process authentication.
    $scope.signInCallback = function (authResult) {
        $scope.$apply(function () {
            $scope.processAuth(authResult);
        });
    };

	$scope.start = function () {
		MpcAPIService.http('/islogin', null, 'GET', function (data) {
			console.log('isLogin', data);

			if (data !== false) {
				console.log('c cool ca marche', data);
				HelloAuth.setUser(data);
				$scope.user = HelloAuth.user;
			}
		}, function (e) {
			console.log('Erreur lors du test de islogin');
		});
	};

    // Call start function on load.
    $scope.start();

}]);
