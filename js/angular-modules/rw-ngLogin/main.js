/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global angular:false, _:false, FB:false, hello:false */
/* ------------------------- */

var social = angular.module("rw-ngLogin", []);

social.factory("HelloAuth", ["$q", 'MpcAPIService', function ($q, MpcAPIService) {
	return {
		logged: false,
		user: {},
		init: function (config) {
			// todo controls
			hello.init(config.keys, config.options);
		},
        login: function (type) {
            var deferred = $q.defer(),
                self = this;
            hello.login(type, {scope: "email"}).then(function () {
				hello(type).api('me').then(function (json) {
					self.logged = true;
					self.user.origin = type;
					self.user.name = json.name;
					self.user.id = json.id;
					self.user.email = json.email;
					self.user.dobObj = json.birthday;
					if (json.gender) {
						json.gender.toString().toLowerCase() === 'male' ? self.user.gender = 'M' : self.user.gender = 'F';
					} else {
						self.user.gender = '';
					}
					self.user.profilePic = json.picture;
					deferred.resolve(json);
				}, function (e) {
					self.logged = false;
					deferred.reject(e);
				});
			}, function (e) {
				self.logged = false;
                deferred.reject(e);
			});
            return deferred.promise;
		},
		setUser: function (data) {
			var self = this;
			self.user = data;
			if (!angular.equals(self.user, {})) {
				self.logged = true;
			}
		},
        logout: function (type) {
			var deferred = $q.defer();
			var self = this;
			self.logged = false;
			self.user = {}
			hello.logout(type).then(function () {
				MpcAPIService.http('/logout', self.user, 'POST', function (data) {
					deferred.resolve(data);
				}, function (e) {
					console.log('Erreur lors de la recherche des infos de l utilisateur');
					deferred.reject(e);
				});
			}, function (e) {
				deferred.reject(e);
			});
			return deferred.promise;
		},
		getUserInfos: function () {
			var deferred = $q.defer();
			self = this;
			MpcAPIService.http('/login', self.user, 'POST', function (data) {
				self.user = data;
				deferred.resolve(data);
			}, function (e) {
				console.log('Erreur lors de la recherche des infos de l utilisateur');
				deferred.reject(e);
			});
			return deferred.promise;
		},
        isLogged: function () {
			return this.logged;
        },isAdminClub : function (idClub) {
			self = this;
			if (!_.isUndefined(self.user) && _.find(self.user.dru, { 'clbdru': idClub, 'grpdru' : 'ADM' })) {
				return true;
			}
			else {
				return false;
			}
		},
		isThisMember : function (idMember) {
			if (!_.isUndefined(self.user) && (self.user.nummbr === idMember)) {
				return true;
			}
			else {
				return false;
			}
		}
    };
}]);
