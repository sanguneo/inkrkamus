/* global define, angular */
// requireJS 모듈 선언
define([
	// 디펜던시가 걸려있으므로, 아래의 디펜던시가 먼저 로드된 뒤에 아래 콜백이 수행된다.
	'registers/lazy-directives',
	'registers/lazy-services',
	'registers/lazy-filters'
],

	// 디펜던시 로드뒤 콜백함수
	function(lazyDirectives, lazyServices, lazyFilters) {
		// 컨트롤러 프로바이더를 받을 변수
		var $controllerProvider;

		/**
		* 컨트롤러 프로바이더 설정 함수
		* @method setControllerProvider
		* @param {아직모름} value - value
		*/
		function setControllerProvider(value) {
			$controllerProvider = value;
		}

		/**
		* 컴파일 프로바이더 설정 함수
		* @method setCompileProvider
		* @param {아직모름} value - value
		*/
		function setCompileProvider(value) {
			lazyDirectives.setCompileProvider(value);
		}

		/**
		* 프로바이드 설정 함수
		* @method setProvide
		* @param {아직모름} value - value
		*/
		function setProvide(value) {
			lazyServices.setProvide(value);
		}

		/**
		* 필터 프로바이더 설정 함수
		* @method setProvide
		* @param {아직모름} value - value
		*/
		function setFilterProvider(value) {
			lazyFilters.setFilterProvider(value);
		}

		/*
		현재 시점에서 services는 오직 value 값을 정할때만 사용할 수 있다.
		Services는 반드시 factory를 사용해야 한다.

		$provide.value('a', 123);
		$provide.factory('a', function() { return 123; });
		$compileProvider.directive('directiveName', ...);
		$filterProvider.register('filterName', ...);
		*/
		/**
		* @method config
		* @param {string} templatePath - ex) ../partials/login.html
		* @param {string} controllerPath - ex) contollers/login
		* @param {object} lazyResources - contollers에서 사용할 의존성이 주입된 모듈들
		* @return {object} routeDefinition - contoller, resolve, template
		*/
		function config(templatePath, controllerPath, lazyResources) {
			// 컨트롤러 프로바이더가 존재하지 않으면 오류!
			if (!$controllerProvider) {
				throw new Error('$controllerProvider is not set!');
			}
			// 변수 선언
			var defer;
			var html;
			var routeDefinition = {};

			routeDefinition.template = function() {
				return html;
			};
			// routeDefinition.templateUrl = './partials/admin.html';
			// 컨트롤러 설정
			routeDefinition.controller = controllerPath.substring(controllerPath.lastIndexOf('/') + 1);

			// 경로
			routeDefinition.resolve = {

				delay: function($q, $rootScope, $route) {
					// Promise오브젝트를 생성하기 위해 $q서비스의 $q.defer()를 실행하여 Deferred 오브젝트를 생성한다
					defer = $q.defer();
					if (html) {
						defer.resolve();
					} else {
						// 템플릿 및 컨트롤러 디펜던시 설정
						var dependencies = ['text!' + templatePath, controllerPath];

						// 리소스들 추가
						if (lazyResources) {
							dependencies = dependencies.concat(lazyResources.directives);
							dependencies = dependencies.concat(lazyResources.services);
							dependencies = dependencies.concat(lazyResources.filters);
						}
						// 디펜던시들 가져오기
						require(dependencies, function() {
							var indicator = 0;
							// 템플릿
							var template = arguments[indicator++];
							// 컨트롤러
							if (angular.isDefined(controllerPath)) {
								$controllerProvider.register(controllerPath.substring(controllerPath.lastIndexOf('/') + 1), arguments[indicator]);
								indicator++;
							}
							if (angular.isDefined(lazyResources)) {
								// 다이렉티브
								if (angular.isDefined(lazyResources.directives)) {
									for (var i = 0; i < lazyResources.directives.length; i++) {
										lazyDirectives.register(arguments[indicator]);
										indicator++;
									}
								}

								// 서비스(value)
								if (angular.isDefined(lazyResources.services)) {
									for (var i = 0; i < lazyResources.services.length; i++) {
										lazyServices.register(arguments[indicator]);
										indicator++;
									}
								}

								// 필터
								if (angular.isDefined(lazyResources.filters)) {
									for (var i = 0; i < lazyResources.filters.length; i++) {
										lazyFilters.register(arguments[indicator]);
										indicator++;
									}
								}
							}
							// 딜레이 걸어놓기
							html = template;
							// promise처리 성공을 나타낸다 successCallback이 실행된다
							defer.resolve();
							// 화면 갱신
							$rootScope.$apply();
							$route.reload();
						});
					}
					return defer.promise;
				}
			};
			return routeDefinition;
		}
		return {
			setControllerProvider: setControllerProvider,
			setCompileProvider: setCompileProvider,
			setProvide: setProvide,
			setFilterProvider: setFilterProvider,
			config: config
		};
	}
);
