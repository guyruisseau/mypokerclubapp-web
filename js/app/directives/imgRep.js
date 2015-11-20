/* --- JSLINT directives --- */
/*jslint sloppy:true*/
/*global webApp:false, Holder:false*/
/* ------------------------- */

webApp.directive('imgRep', function () {
    return {
		scope: {
			size: '@'
		},
        link: function (scope, element, attrs) {
			element[0].src = 'holder.js/' + scope.size;
            Holder.run({ images: element[0], nocss: true });
        }
    };
});
