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

	$scope.isAdminClub = function () {
		return MpcLoginService.isAdminClub($scope.currentClub.id);
	};

	$scope.isThisMember = function (idMember) {
		return MpcLoginService.isThisMember(idMember);
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
		console.log("test");
		$scope.getUserInfo();
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


	// This flag we use to show or hide the button in our HTML.
    $scope.signedIn = false;

    // Here we do the authentication processing and error handling.
    // Note that authResult is a JSON object.
    $scope.processAuth = function(authResult) {
		console.log(authResult);
        // Do a check if authentication has been successful.
        if(authResult['access_token']) {
            // Successful sign in.
            $scope.signedIn = true;

            //     ...
            // Do some work [1].
            //     ...
        } else if(authResult['error']) {
            // Error while signing in.
            $scope.signedIn = false;

            // Report error.
        }
    };

    // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        $scope.$apply(function() {
            $scope.processAuth(authResult);
        });
    };

    // Render the sign in button.
    $scope.renderSignInButton = function() {
        /*gapi.signin.render('signInButton',
            {
                'callback': $scope.signInCallback, // Function handling the callback.
                'clientid': '[CLIENT_ID from Google developer console]', // CLIENT_ID from developer console which has been explained earlier.
                'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                                                                                  // as their explanation is available in Google+ API Documentation.
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                'cookiepolicy': 'single_host_origin'
            }
        );*/
    }

    // Start function in this example only renders the sign in button.
    $scope.start = function() {
        $scope.renderSignInButton();
    };

    // Call start function on load.
    $scope.start();

	// Process user info.
// userInfo is a JSON object.
$scope.processUserInfo = function(userInfo) {
	console.log('processUserInfo', userInfo);
    // You can check user info for domain.
    if(userInfo['domain'] == 'mycompanydomain.com') {
        // Hello colleague!
    }

    // Or use his email address to send e-mails to his primary e-mail address.
    sendEMail(userInfo['emails'][0]['value']);
}

// When callback is received, process user info.
$scope.userInfoCallback = function(userInfo) {
    $scope.$apply(function() {
        $scope.processUserInfo(userInfo);
    });
};

// Request user info.
$scope.getUserInfo = function() {
    gapi.client.request(
        {
            'path':'/plus/v1/people/me',
            'method':'GET',
            'callback': $scope.userInfoCallback
        }
    );
};
}]);
