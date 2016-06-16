/* global define */
'use strict';

define([/*foo/bar*/], function () {
	return ['listbox', function () {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/listbox.html',
			replace: 'true',
			scope: {
				data: '=lbData'
			},
			controller: ['$scope', function ($scope) {
			}],
			link: function (/* scope (can be used.) */) {
				// $('#example').fadeIn(300);
			}
		};
	}];
});
