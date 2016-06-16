/* global define */

'use strict';
// requireJS 모듈 선언 - [myApp 앵귤러 모듈]
define(
	[
		'jquery',
		// 앵귤러 모듈을 사용하기 위해 임포트
		'angular',
		// registers에 각 프로바이더를 제공하기 위해 임포트
		'route_config'
	],

/*
	이 부분도 주의깊게 살펴봐야한다.
	위의 디펜던시들이 모두 로드된 뒤에 아래의 콜백이 실행된다.
	디펜던시들이 리턴하는 객체들을 콜백함수의 파라메터로 받게 되는데,
	자세히보면 route-config와 같이 snake case로 된 파일명이,
	파라메터로 받을 때는 routeConfig와 같이 camel case로 바뀌는 것을 볼 수 있다.
*/
	// 디펜던시 로드뒤 콜백함수
	function($, angular, routeConfig) {
		var app = angular.module('myApp', ['ngRoute', 'ngAnimate'],
		function($provide, $compileProvider,
			$controllerProvider, $filterProvider) {
			// 부트스트랩 과정에서만 가져올 수 있는 프로바이더들을 각 registers와 연계될 수 있도록
			// for services
			routeConfig.setProvide($provide);
			// for directives
			routeConfig.setCompileProvider($compileProvider);
			// for controllers
			routeConfig.setControllerProvider($controllerProvider);
			// for filters
			routeConfig.setFilterProvider($filterProvider);
		}).service('header', ['$location', '$timeout', function($location, $timeout) {
		}]).service('commonVariable', ['header', '$location', function(header, $location) {
			var commonVariable = this;
		}]);

		// 공통 컨트롤러 설정 - 모든 컨트롤러에서 공통적으로 사용하는 부분들 선언
		app.controller('CommonController', function($scope, $http, header, commonVariable) {
			var checkConnectionTimer = null;
			// 스타일시트 업데이트
			$scope.$on('updateCSS', function(event, args) {
				// 파라메터로 받아온 스타일 시트 반영
				$scope.stylesheets = args;
			});

			// 각 페이지의 데이터 업데이트 중지
			// $scope.$on('clearUpdateData', function(event, args) {
			$scope.$on('clearUpdateData', function() {
			});

			// Menu Data
			$http.get('data/example.json').success(function(data) {
				console.log(data);
			});

			$scope.$on('$viewContentLoaded', function() {
			});
			$scope.$watch(
				function() {
					return header;
				}, function(headerData) {
				$scope.showDashboardHeader = headerData.showDashboardHeader;
			}, true);
		});
		return app;
	}
);
