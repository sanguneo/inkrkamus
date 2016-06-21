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

		/*--[ begin initialVocaList ]--*/
		var vocaLength = 0;
		var offset = 0;
		var initialVocaList;
		initialVocaList = function initialVocaList(limit) {
			var sql = 'SELECT `ID`, `in` from data limit ' + limit + ' offset ' + offset + ' ;';
			offset += limit;
			db.each(sql, function (err, row) {
				$scope.data.vocalist.allList.push(row);
			});
			$timeout(function(){
				$scope.$apply();
				if(vocaLength > offset){
					initialVocaList(limit);
				}
			}, 25);
		};

		db.get("SELECT COALESCE(MAX(id)+1, 0) as count FROM data", function (err, row) {
			$scope.data.vocalist.list = $scope.data.vocalist.allList;
			vocaLength = parseInt(row.count);
			initialVocaList(50);
		});
		/*--[ end initialVocaList ]--*/

		/*--[ begin getVocaList ]--*/
		var getVocaList = function getVocaList(sqlPostfix) {
			$scope.data.vocalist.list = undefined;
			$scope.data.vocalist.list = $scope.data.vocalist.specList;
			var sql = 'SELECT `ID`, `in` from data where ' + sqlPostfix + ';';
			db.each(sql, function (err, row) {
				$scope.data.vocalist.specList.push(row);
			});
		};
		/*--[ end getVocaList ]--*/

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
				sqlPostfix = "`in`=\"" + input + "\";"
				getVocaList(sqlPostfix);
				return;
				break;
			case 'kr' :
				sqlPostfix = "`in`=\"" + input + "\";"
				getVocaList(sqlPostfix);
				return;
				break
			case 'rt' :
				sqlPostfix = "`in`=\"" + input + "\";"
				getVocaList(sqlPostfix);
				return;
				break
			default :
				return;
				break;
			}
			db.each("SELECT `rt`,`en`,`kr` FROM data where " + sqlPostfix, function (err, rows) {
				console.log(rows.kr.replace('/♬/gi','\\n'))
				$scope.data.result = rows;
				$scope.data.result.kr = $scope.data.result.kr.replace('/\♬/g','\n');
			});
		};

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
