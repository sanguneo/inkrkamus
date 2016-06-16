/* global define */

'use strict';

define(['formplate'], function () {
	return ['formplateLoad', function ($scope) {
		if ($scope.stylesheets.indexOf('css/example.css') < 0)
			$scope.stylesheets.push('lib/formplate/css/formplate.css');
	}];
});