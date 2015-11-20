/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false*/
/* ------------------------- */

webApp.controller("LoginCtrl", ["$scope", '$window', '$state', '$cookieStore', function ($scope, $window, $state, $cookieStore) {
	// Set user details
    $scope.user = $cookieStore.get('userInfo');

    // Logout user
    $scope.logout = function () {
		FB.logout(function(response) {
        	// Person is now logged out
    	});
        $cookieStore.remove("userInfo");
        $state.go('home');
        $window.location.reload();

		$scope.user = null;
    };
}]);
