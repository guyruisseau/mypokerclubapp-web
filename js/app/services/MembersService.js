/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, _:false*/
/* ------------------------- */

webApp.factory("MembersService", [function () {
	return {
		initData: function (data) {
			data = _.each(data, function (element) {
				if (element.stambc === "I") {
					element.inactive = false;
				} else {
					element.inactive = true;
				}
			});
			return _.sortByOrder(data, ['psdmbr'], [true]);
		},
		getNbAct: function (data) {
			var nbact = 0;
			_.each(data, function (element) {
				if (element.stambc === "A") {
					nbact++;
				}
			});
			return nbact;
		},
		getNbInact: function (data) {
			var nbinact = 0;
			_.each(data, function (element) {
				if (element.stambc === "I") {
					nbinact++;
				}
			});
			return nbinact;
		}
	};
}]);
