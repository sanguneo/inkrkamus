/* global define */
'use strict';

define([/*foo/bar*/], function () {
	return ['exampleDirective', function () {
		return {
			/**
			 * restrict type
			 * | type		comment		sample
			 * | 'E'		element		<example-directive></example-directive>
			 * | 'A'		attribute	<div example-directive></div>
			 * | 'C'		class		<div class="example-directive"></div>
			 * | 'M'		comment		< !-- directive: example-directive-->
			 */
			restrict: 'E',
			/**
			 * Template html url
			 */
			templateUrl: 'partials/directives/example.html',
			replace: 'true',
			scope: {
				/**
				 * data target. from scope.
				 * usage) <example-directive d-data="foo.bar">
				 */
				data: '=dData'
			},
			/**
			 * Logic Controls Usually <$scope, $element, $timeout ...>
			 */
			controller: ['$scope', function ($scope) {
				//$scope.foo = 'bar';
				//$scope.func = function() {
				//   $scope.foo = 'omg';
				//};
				var fs = window.requireNode('fs');
				var file = fs.readFileSync('package.json');
				alert(file);
			}],
			/**
			 * Dom Controls Usually
			 */
			link: function (/* scope (can be used.) */) {
				// $('#example').fadeIn(300);
			}
		};
	}];
});
