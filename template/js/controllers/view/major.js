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
	var _controller = function ($scope, $location, $timeout, majorData, commonVariable, formplateLoad, mCustomScrollbarLoad) {
		// CSS 설정
		$scope.$emit('updateCSS', [
			'css/view/major.css'
		]);
		formplateLoad($scope);
		mCustomScrollbarLoad($scope);

		/*
		$scope.$on('$includeContentLoaded', function(event, url) {
		});
		$scope.$on('$locationChangeStart', function() {
		});
		*/

		$scope.data = majorData.data;

		new formplate({
			selector: '.form-el'
		});

	};
	// 생성한 컨트롤러 리턴
	return _controller;
});
