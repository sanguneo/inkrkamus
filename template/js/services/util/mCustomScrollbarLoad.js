/* global define */

'use strict';

define(['mCustomScrollbar'], function () {
	return ['mCustomScrollbarLoad', function ($scope) {
		if ($scope.stylesheets.indexOf('lib/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css') < 0)
			$scope.stylesheets.push('lib/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css');
	}];
});