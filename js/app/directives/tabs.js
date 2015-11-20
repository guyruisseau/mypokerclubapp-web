/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false, Holder:false*/
/* ------------------------- */

webApp.directive('tabs', function () {
	return function link(scope, tabsElement) {
		tabsElement.find(".nav-tabs li").on('click', selectThisTab);

		function selectThisTab() {
			var tab = angular.element(this);
			var tabContent = tabsElement.find(".tab-content div").eq(tab.index());

			tabsElement.find(".active").removeClass('active');
			tab.addClass('active');
			tabContent.addClass("active");
		}
	};
});
