/* global define */

'use strict';

define([], function () {
	return ['majorData', {
		data: {
			result: {
				rt: '',
				en: '',
				kr: ''
			},
			h2r:{
			},
			submit: function(){
				if (!this.search.value || this.search.value.replace(/ /g, '') === '') return;
				if (this.search.list.indexOf(this.search.value) < 0) {
					this.search.list.push(this.search.value);
				}
				var type = "in";
				switch(this.$parent.data.type.selected) {
				case 1 :
					type = 'kr';
					break;
				case 2 :
					type = 'en';
					break;
				case 3 :
					type = 'rt';
					break;
				case 0 :
				default :
					break;
				}
				console.log(type);
				this.$parent.getVocaMean(this.search.value, type);
			},
			search: {
				id: 'searchInput',
				name: 'searchName',
				resize: true,
				list: [],
				itemClick: function() {
					this.$parent.toggler();
					this.$parent.data.value = this.item;
				},
				keypress: function($event){
					if ($event.keyCode === 13) {
						this.$parent.submit()
					}
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
					this.$parent.$parent.getVocaMean(this.item.ID, 'id');
				},
				index: 'in',
				list: [],
				allList: [],
				specList: []
			}
		}
	}];
});
