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

		var sqlite3 = requireNode('sqlite3').verbose();
		var db = new sqlite3.Database(__dirname + '/data/ik.wkdb');

		new formplate({ selector: '.form-el'});

		$scope.$emit('updateCSS', [
			'css/view/major.css'
		]);

		$scope.data = majorData.data;

		$timeout(function () {
			$scope.include = 'partials/view/major/major_include.html';
		},1000);

		$timeout(function () {
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
			$('#result').css({transition: 'all 1s'});
		});

		window.scope = $scope;
		$scope.data.$parent = window.scope;
		$scope.data.search.$parent = $scope.data;
		window.scope = undefined;
		delete window.scope;

		$scope.getVocaMean = function (input, type) {
			var sqlPostfix = "";
			switch(type) {
			case 'id' :
				sqlPostfix = "`ID`=\"" + input + "\";"
				break;
			case 'in' :
				sqlPostfix = "`in`=\"" + input + "\";"
				break;
			case 'en' :
				break;
			case 'kr' :
				break
			case 'rt' :
				break
			default :
				break;
			}
			db.each("SELECT `rt`,`en`,`kr` FROM data where " + sqlPostfix, function (err, rows) {
				console.log(rows.kr.replace('/♬/gi','\\n'))
				$scope.data.result = rows;
				$scope.data.result.kr = $scope.data.result.kr.replace('/\♬/g','\n');
			});
		};

		var vocaLength = 0;
		var offset = 0;
		var getVocaList;
		getVocaList = function getVocaList(limit) {
			var sql = 'SELECT `ID`, `in` from data limit ' + limit + ' offset ' + offset + ' ;';
			offset += limit;
			db.each(sql, function (err, row) {
				$scope.data.vocalist.list.push(row);
			});
			$timeout(function(){
				$scope.$apply();
				if(vocaLength > offset){
					getVocaList(limit);
				}
			}, 25);
		};
		db.get("SELECT COALESCE(MAX(id)+1, 0) as count FROM data", function (err, row) {
			vocaLength = parseInt(row.count);
			getVocaList(25);
		});



		$scope.$on('$includeContentLoaded', function(){
			$timeout(function(){
				$('#result').addClass('opened');
			});
			$timeout(function(){
				(function getRomanConvert() {
					db.each("SELECT * FROM h2r", function (err, row) {
						$scope.data.h2r[row.han] = row.rom;
					});
				})();
			},100);
		});

		window.addEventListener("beforeunload", function(e){
			db.close();
		}, false);
	};
	// 생성한 컨트롤러 리턴
	return _controller;
});
