/* global define */

'use strict';

define(['formplate'], function () {
	return ['formplateLoad', function ($scope) {
		if ($scope.stylesheets.indexOf('lib/formplate/css/formplate.css') < 0)
			$scope.stylesheets.push('lib/formplate/css/formplate.css');
	}];
});