/* global define */

'use strict';

define([], function () {
	return ['majorData', {
		data: {
			search: {
				id: 'searchInput',
				name: 'searchName'
			},
			vocalist: {
				id: 'vocalistE',
				name: 'vocalistE',
				itemClick: function(){
					var clickedItem = this;
					console.log(clickedItem.voca);
				},
				vocas: [1,2,3]
			}
		}
	}];
});
