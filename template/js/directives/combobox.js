/* global define */
'use strict';

define([/*foo/bar*/], function () {
	return ['combobox', function () {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/combobox.html',
			replace: 'true',
			scope: {
				data: '=cbData'
			},
			controller: ['$scope', function ($scope) {
			}],
			link: function (/* scope (can be used.) */) {
				// $('#example').fadeIn(300);
			}
		};
	}];
});
