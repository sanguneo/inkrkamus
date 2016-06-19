/* global define */

'use strict';

define(['detectElementResize'], function(resizer) {
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
		$timeout(function () {
			new formplate({
				selector: '.form-el'
			});
		}, 10);

		var inputDropDown = function () {
			var InputForm = $('.searchInput  .form-el input')[0].getBoundingClientRect();
			 $('.searchInput > .dropdown').css({
			 	top: (InputForm.top + InputForm.height) + 'px',
			 	left: InputForm.left + 'px',
			 	width: InputForm.width + 'px'
			 })
		};
		$('.searchInput  .form-el').resize(function(){
			inputDropDown();
		});
	};
	// 생성한 컨트롤러 리턴
	return _controller;
});
