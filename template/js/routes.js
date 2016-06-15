/* global define */
'use strict';

define([
	// 생성한 앵귤러 모듈에 루트를 등록하기 위해 임포트
	'app',
	// 루트를 등록하는 routeConfig를 사용하기 위해 임포트
	'route_config'
], function(app, routeConfig) {
		// app은 생성한 myApp 앵귤러 모듈
		return app.config(function($routeProvider) {
			// Home
			$routeProvider.when('/example', routeConfig.config('../partials/view/example/example.html', 'controllers/view/example',
				{
					directives: ['directives/example'],
					services: ['services/view/example_data'],
					filters: ['filters/to_trusted', 'filters/decodeURIComponent']
				}
			));
			// 기본 경로 설정
			$routeProvider.otherwise({redirectTo: '/example'});
		});
	});
