/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global angular:false, _:false, FB:false */
/* ------------------------- */

var mpcApi = angular.module('mpc.login', ['mpc.api']);

mpcApi.factory("MpcLoginService", ['$cookieStore', 'MpcAPIService', '$state', '$window', function ($cookieStore, MpcAPIService, $state, $window) {
	return {
		fbLogin : function (scope) {

			FB.login(function (response) {
				console.log('Facebook login !!!!!', response);
				if (response.authResponse) {
					getUserInfo();
					scope.closeThisDialog();
				} else {
					console.log('User cancelled login or did not fully authorize.');
				}
			}, {scope: 'email,user_photos,user_videos'});

			function getUserInfo() {
				// get basic info
				FB.api('/me',{fields: 'name,last_name,gender,email,birthday,first_name'}, function (response) {
					console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
					// get profile picture
					FB.api('/me/picture?type=normal', function (picResponse) {
						console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
						response.imageUrl = picResponse.data.url;
						// store data to DB - Call to API
						// Todo
						// After posting user data to server successfully store user data locally
						var user = {};
						user.origin = 'Facebook';
						user.name = response.name;
						user.id = response.id;
						user.email = response.email;
						user.dobObj = response.birthday;
						if (response.gender) {
							response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
						} else {
							user.gender = '';
						}
						user.profilePic = picResponse.data.url;

						//$scope.user = user;

						$cookieStore.put('userInfo', user);

						MpcAPIService.http('/login', user, 'POST', function (data) {
							console.log('Infos du login', data);

						});

						$state.go('login');

					});
				});
			}
		},
		gplusLogin : function () {
			console.log('googlelogin !!!');
		},
		logout : function () {
			FB.logout(function (response) {
				// Person is now logged out
			});
			$cookieStore.remove("userInfo");
			//$state.go('home');
			$window.location.reload();
		},
		isLogin : function () {
			return !_.isUndefined($cookieStore.get('userInfo'));
		}
	};
}]);
