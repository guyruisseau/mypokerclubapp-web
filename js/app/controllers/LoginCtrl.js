/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("LoginCtrl", ["$scope", '$window', '$state', 'HelloAuth', 'MpcAPIService', function ($scope, $window, $state, HelloAuth, MpcAPIService) {
	// Set user details
    $scope.user = HelloAuth.user;

	if (angular.equals($scope.user, {})) {

		MpcAPIService.http('/islogin', null, 'GET', function (data) {
			console.log('isLogin', data);

			if (data !== false) {
				$scope.user = data;
			}
		}, function (e) {
			// En cas d'erreur on retourne à l'accueil
			$state.go('home');
			$window.location.reload();
		});
	}

    // Logout user
    $scope.logout = function () {
		$scope.helloLogout();
    };
}]);
