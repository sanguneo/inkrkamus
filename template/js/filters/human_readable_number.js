/* global define */

'use strict';

define(['angular'], function() {
	return ['humanReadableNumber', function() {
		return function(byteTextNumber) {
			while (byteTextNumber > 1024) {
				byteTextNumber /= 1024;
			}
			var number = parseFloat(byteTextNumber).toFixed(1);
			return number;
		};}];
});
