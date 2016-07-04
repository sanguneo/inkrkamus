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
		var sqlite3 = window.requireNode.sqlite3.verbose();
		var db = new sqlite3.Database(__dirname + '/data/ik.wkdb');

		new formplate({ selector: '.form-el'});

		$scope.$emit('updateCSS', [
			'css/view/major.css'
		]);

		$scope.data = majorData.data;

		{
			window.scope = $scope;
			$scope.data.$parent = window.scope;
			$scope.data.search.$parent = $scope.data;
			window.scope = undefined;
			delete window.scope;
		}
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
			$('#fog').css({transition: 'opacity 1s'});
			$('#searchType .dropdown li').click(function(e){
				$scope.data.result = {rt: '', en: '', kr: ''};
				if (e.target.innerText === '한국어') {
					$scope.data.result.kr = $scope.data.resultKrDefault + '';
				}
			});

			$('#searchType input').on('keydown', function(event){
				if (event.keyCode === 40) {
					var lis = $(this).parent().parent().next().find('li');
					var i=0;
					for (i=0; i <lis.length;i++){
						if(lis[i].innerText === this.value) break;
					}
					if (i === lis.length - 1) return;
					$scope.data.type.value = lis[i+1].innerText;
					$scope.data.type.selected = i+1;
					$scope.data.result = {rt: '', en: '', kr: ''};
					if ($scope.data.type.value === '한국어') {
						$scope.data.result.kr = $scope.data.resultKrDefault + '';
					}
					$scope.$apply();
				} else if (event.keyCode === 38) {
					var lis = $(this).parent().parent().next().find('li');
					var i=0;
					for (i=0; i <lis.length;i++){
						if(lis[i].innerText === this.value) break;
					}
					if (i === 0) return;
					$scope.data.type.value = lis[i-1].innerText;
					$scope.data.result = {rt: '', en: '', kr: ''};
					$scope.data.type.selected = i-1;
					$scope.data.result = {rt: '', en: '', kr: ''};
					if ($scope.data.type.value === '한국어') {
						$scope.data.result.kr = $scope.data.resultKrDefault + '';
					}
					$scope.$apply();

				}
			})
		});

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
			$scope.data.vocalist.list = undefined;
			$scope.data.vocalist.list = $scope.data.vocalist.allList;
			vocaLength = parseInt(row.count);
			initialVocaList(25);
		});
		/*--[ end initialVocaList ]--*/

		/*--[ begin getVocaList ]--*/
		var getVocaList = function getVocaList(sqlPostfix) {
			$scope.data.vocalist.list = undefined;
			$scope.data.vocalist.specList = [];
			$scope.data.vocalist.list = $scope.data.vocalist.specList;
			var sql = 'SELECT `ID`, `in` from data where ' + sqlPostfix + ';';
			db.each(sql, function (err, row) {
				$scope.data.vocalist.specList.push(row);
			});
			$timeout(function(){
				$scope.$apply();
			});
		};

		/*--[ end getVocaList ]--*/

		$scope.getVocaMean = function (input, type) {
			$scope.data.result = {
				rt: '',
				en: '',
				kr: ''
			};
			var sqlPostfix = "";
			switch(type) {
			case 'id' :
				sqlPostfix = "`ID`=\"" + input + "\";";
				break;
			case 'in' :
				sqlPostfix = "`in`=\"" + input + "\";";
				break;
			case 'en' :
				sqlPostfix = "`en` LIKE \"" + input + "\" or `en` LIKE \"" + input + ", %%\" or `en` LIKE \"%% " + input + ",\" or `en` LIKE \"%% " + input + ",%%\" or `en` LIKE \"%% " + input + "\";";
				getVocaList(sqlPostfix);
				return;
				break;
			case 'kr' :
				sqlPostfix = "`kr` LIKE \"%%" + input + "%%\";";
				getVocaList(sqlPostfix);
				return;
				break;
			case 'rt' :
				sqlPostfix = "`rt` LIKE \"" + input + "\" or `rt` LIKE \"" + input + ", %%\" or `rt` LIKE \"%% " + input + ",\" or `rt` LIKE \"%% " + input + ",%%\" or `rt` LIKE \"%% " + input + "\";";
				getVocaList(sqlPostfix);
				return;
				break;
			default :
				return;
				break;
			}
			db.each("SELECT `rt`,`en`,`kr` FROM data where " + sqlPostfix, function (err, row) {
				$scope.data.result = row;
			},function(err, rows){
				if (rows <= 0) {
					alert('겁색결과가 없습니다.');
				}
			});
		};

		$scope.$on('$includeContentLoaded', function(){
			$timeout(function(){
				$('#result').addClass('opened');
				
			});
			(function getRomanConvert() {
				db.each("SELECT * FROM h2r", function (err, row) {
					$scope.data.h2r[row.han] = row.rom;
				});
			})();
			
		});
		$timeout(function(){
			$('#else > iframe').animate({width:'100%', height:'100%',marginLeft:0});
		},1000);
		$scope.ignore = function(event){
			if ((event.keyCode === 45 && event.ctrlKey === true) ||
				(event.keyCode === 67 && event.ctrlKey === true)) {
			} else if (event.keyCode === 65 && event.ctrlKey === true){
				event.target.setSelectionRange(0, event.target.value.length);
			} else {
				event.preventDefault();
			}
		};
		$scope.information = function(){
			$('#fog').animate({opacity:1}, {
				duration: 500, start: function() {
					$('#fog').css({
						display:'block'
					});
				}
			});
			$('#fog > #informationDialog').toggleClass('opened');
		};
		$scope.closeInfoDialog = function(){
			$('#fog').css({
				opacity: 0,
				display: 'none'
			});
			$('#fog > #informationDialog').toggleClass('opened');
		};
		$scope.romanize = function(){
			if ($scope.data.result.temporary && $scope.data.result.temporary !== '') {
				$scope.data.result.kr = $scope.data.result.temporary;
				$scope.data.result.temporary = undefined;
			}else {
				var romanized = '';
				for (var i = 0; i < $scope.data.result.kr.length; i++) {
					romanized += $scope.data.h2r[$scope.data.result.kr[i]] || $scope.data.result.kr[i];
				}
				$scope.data.result.temporary = $scope.data.result.kr;
				$scope.data.result.kr = romanized;
			}
		};
		$scope.donation = function(href){
			window.requireNode.shell.openExternal(href);
		};
		$scope.close = function(){
			vocaLength = -1;
			window.close();
		};
		window.addEventListener("beforeunload", function(e){
			db.close();
		}, false);

	};
	// 생성한 컨트롤러 리턴
	return _controller;
});
