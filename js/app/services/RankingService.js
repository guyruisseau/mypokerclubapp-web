/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, _:false, moment:false*/
/* ------------------------- */

webApp.factory("RankingService", [function () {
	return {
		initData: function (data) {
			data.strrnk = moment(data.strrnk).format('DD/MM/YYYY');
			data.endrnk = moment(data.endrnk).format('DD/MM/YYYY');
			return data;
		},
		initDataMembers: function (data) {
			return data;
		},

		initDataParties: function (data) {

			return _.each(data, function (element) {
				element.dtemtt = moment(element.dtemtt).format('dddd DD/MM/YYYY à HH:mm');
			});
		}
	};
}]);
