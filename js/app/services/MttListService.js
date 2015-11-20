/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, _:false, moment:false*/
/* ------------------------- */

webApp.factory("MttListService", [function () {
	return {
		initData: function (data) {
			return _.each(data, function (element) {
				element.dtemtt = moment(element.dtemtt).format('dddd DD/MM/YYYY à HH:mm');
			});
		}
	};
}]);
