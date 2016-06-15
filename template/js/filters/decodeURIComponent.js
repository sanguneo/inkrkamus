/* global define */
/**
 * Created by sanguneo on 15. 12. 30.
 */

'use strict';

define([], function() {
	return ['decodeURIComponent', function() {
		return function(input) {
			return decodeURIComponent(input);
		};}];
});