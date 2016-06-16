/* global define */
'use strict';

define(['mCustomScrollbar'], function (mCustomScrollbar) {
	return ['listbox', function () {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/listbox.html',
			replace: 'true',
			scope: {
				data: '=lData'
			},
			controller: ['$scope','$element','$timeout', function ($scope, $element, $timeout) {
					$timeout(function(){$element.children('ul').mCustomScrollbar({
									axis: 'y',
									theme: 'dark-thin',
									scrollbarPosition: 'outside',
									mouseWheel: {
										enable: true
									}
								});});
			}],
			link: function (/* scope (can be used.) */) {
				// $('#example').fadeIn(300);
			}
		};
	}];
});
