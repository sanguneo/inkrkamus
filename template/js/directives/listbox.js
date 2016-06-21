/* global define */
'use strict';

define([], function () {
	return ['listbox', function () {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/listbox.html',
			replace: 'true',
			scope: {
				data: '=lData'
			},
			controller: ['$scope','$element','$timeout', function ($scope, $element, $timeout) {
				$scope.itemClick = $scope.data.itemClick;
			}],
			link: function (/* scope (can be used.) */) {
			}
		};
	}];
});
