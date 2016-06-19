/* global define */

'use strict';

define([], function () {
	return ['majorData', {
		data: {
			submit: function(){
				if (!this.search.value|| this.search.value === '') return;
				if (this.search.list.indexOf(this.search.value) < 0) {
					this.search.list.push(this.search.value);
				}
			},
			search: {
				id: 'searchInput',
				name: 'searchName',
				resize: true,
				list: [1,2,3,4,5,6,7,8,9,0],
				itemClick: function() {
					var clickedItem = this;
					this.$parent.toggler();
					this.$parent.data.value = this.item;
				}
			},
			type: {
				id: 'searchType',
				name: 'searchType',
				readonly: true,
				selected: 0,
				list: ['인니어', '한국어', '영어', '어근']
			},
			vocalist: {
				id: 'vocalistE',
				name: 'vocalistE',
				itemClick: function(){
					var clickedItem = this;
					console.log(clickedItem.voca);
				},
				list: [1,2,3]
			}
		}
	}];
});
