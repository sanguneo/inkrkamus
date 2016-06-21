/* global define */

'use strict';

define(['detectElementResize'], function () {
	/*
	 * 컨트롤러 선언
	 * @method _controller
	 * @param {object} $scope - $scope
	 * @param {object} $location - $location
	 * @param {object} exampleData - exampleData
	 * @param {object} commonVariable - commonVariable
	 */
	var _controller = function ($scope, $location, $timeout, majorData, commonVariable) {
		// CSS 설정
		$scope.$emit('updateCSS', [
			'css/view/major.css'
		]);

		var sqlite3 = requireNode('sqlite3').verbose();
		var db = new sqlite3.Database(__dirname + '/data/ik.wkdb');
		$scope.data = majorData.data;

		$timeout(function(){
			(function getRomanConvert() {
				db.each("SELECT * FROM h2r", function (err, row) {
					$scope.data.h2r[row.han] = row.rom;
				});
			})();
			$('li').click(function(){
				console.log($(this).text());
			})
		});

		window.scope = $scope;
		$scope.getVocaMean = function () {
			db.each("SELECT `in` FROM data", function (err, row) {
				console.log(row);
			});
		};

		$timeout(function () {
			new formplate({
				selector: '.form-el'
			});
			var height = 0;
			$('#mean').parent().siblings().each(function () {
				height += $(this).height();
			});
			$('#mean').parent().css({
				height: 'calc(100% - ' + height + 'px)'
			});
			$('#mean').css({
				height: 'calc(100% - ' + ($('#mean').prev().height() + 34) + 'px)',
				marginBottom: 0,
				transitionDuration: 0
			});
		});
		$scope.listclick = function($event){
			$scope.data.search.value = $event.target.innerText;
			if ($scope.data.search.list.indexOf($scope.data.search.value) < 0) {
				$scope.data.search.list.push($scope.data.search.value);
			}
		};
		window.addEventListener("beforeunload", function(e){
			db.close();
		}, false);
	};
	// 생성한 컨트롤러 리턴
	return _controller;
});
