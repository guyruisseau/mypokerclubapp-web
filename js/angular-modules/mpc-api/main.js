/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global angular:false, _:false*/
/* ------------------------- */

var mpcApi = angular.module('mpc.api', []);

mpcApi.factory("MpcAPIAuth", [function () {
	return {
		isAuthenticated: function () {
			return !_.isUndefined(this.clientInformations);
		},
		updateClientInformations: function (authentificationHeader) {
			if (authentificationHeader === 'deleted') {
				delete this.clientInformations;
			} else {
				this.clientInformations = authentificationHeader;
			}
		},
		getDisplayableUser: function () {
			if (this.isAuthenticated()) {
				return this.clientInformations.nomusr + ' ' + this.clientInformations.preusr;
			} else {
				return '';
			}
		}
	};
}]);

mpcApi.factory("MpcAPIService", ['MpcAPIAuth', '$http', '$log', function (MpcAPIAuth, $http, $log) {
	return {
		url: 'http://192.168.1.11/myPokerClubWs/index.php',
		//url: 'http://api.mypokerclubapp.com/index.php',
		http: function (route, params, method, successCallback, failCallback) {
			var httpConf = {
					method: (method || 'GET'),
					data: params,
					url: this.url + route,
					withCredentials: true
				},
				headers,
				httpRequest;

			httpRequest = $http(httpConf);
			httpRequest.success(function (data, status, headers, config) {
				$log.debug('API_Success => ');
				$log.debug(data);
				/*if (headers('cvapplicationsessionclientinfos')) {
					CvAPIAuth.updateClientInformations(angular.fromJson(headers('cvapplicationsessionclientinfos')));
				}*/
				if (_.isFunction(successCallback)) {
					successCallback(data);
				}
			});
			httpRequest.error(function (data, status, headers, config) {
				if (_.isFunction(failCallback)) {
					failCallback(data);
				}
			});
			return httpRequest;
		},
		login: function (mail, password, successCallback, failCallback) {
			this.http('/login', {mail: mail, password: password}, 'POST', successCallback, failCallback);
		}
	};
}]);

/*mpcApi.factory("CvAPIUtilities", [function () {
	return {
		url: 'http://uploads.cantalvolley.fr',
		calculateImagePath: function (data, entity, property, idProperty) {
			var self = this;
			_.each(data, function (element) {
				if (element.hasOwnProperty(idProperty)) {
					element[property] = self.getImagePath(entity, element[idProperty]);
				}
			});
		},
		getImagePath: function (entity, id) {
			return this.url + '/' + entity + '/' + id + '.jpg';
		}
	};
}]);*/
