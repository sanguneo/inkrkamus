/* global define */

'use strict';

define(['detectElementResize'], function() {
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

		$scope.data = majorData.data;

		$scope.getVocaList = function(){

		}
		$scope.getVocaMean = function(){
		}

		$timeout(function () {
			new formplate({
				selector: '.form-el'
			});
			var height = 0;
			$('#mean').parent().siblings().each(function(){
				height += $(this).height();
			});
			$('#mean').parent().css({
				height: 'calc(100% - ' + height + 'px)'
			})
			$('#mean').css({
				height: 'calc(100% - ' + ($('#mean').prev().height() + 34) + 'px)',
				marginBottom: 0,
				transitionDuration: 0
			});
		});


	};
	// 생성한 컨트롤러 리턴
	return _controller;
});
