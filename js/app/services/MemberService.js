/* --- JSLINT directives --- */
/*jslint sloppy:true, nomen:true*/
/*global webApp:false, _:false, moment:false*/
/* ------------------------- */

webApp.factory("MemberService", [function () {
	return {
		initDataRankings: function (data) {
			return _.each(data, function (element) {
				element.strrnk = moment(element.strrnk).format('DD/MM/YYYY');
				element.endrnk = moment(element.endrnk).format('DD/MM/YYYY');
			});
		},

		initDataParties: function (data) {

			return _.each(data, function (element) {
				element.dtemtt = moment(element.dtemtt).format('dddd DD/MM/YYYY à HH:mm');
			});
		}
	};
}]);
