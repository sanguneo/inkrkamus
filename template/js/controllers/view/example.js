/* global define */

'use strict';

define([], function() {
	/*
	 * 컨트롤러 선언
	 * @method _controller
	 * @param {object} $scope - $scope
	 * @param {object} $location - $location
	 * @param {object} exampleData - exampleData
	 * @param {object} commonVariable - commonVariable
	 */
	var _controller = function ($scope, $location, $timeout, exampleData, commonVariable, formplateLoad) {

		// CSS 설정
		$scope.$emit('updateCSS', [
			'css/example.css'
		]);
		/*
		$scope.$on('$includeContentLoaded', function(event, url) {
		});
		$scope.$on('$locationChangeStart', function() {
		});
		*/

		$scope.data = exampleData.data;

		formplateLoad($scope);
	};
	// 생성한 컨트롤러 리턴
	return _controller;
});
