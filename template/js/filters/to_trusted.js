/* global define */

'use strict';

define(['angular'], function() {
	return ['toTrusted', function($sce) {
		return $sce.trustAsHtml;
	}];
});
