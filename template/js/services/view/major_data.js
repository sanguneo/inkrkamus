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
			resultKrDefault: 	'한글로 검색하실 경우 정확한 단어로 검색해주셔야 \n' +
								'정확한 결과를 얻을 수 있습니다.\n\n' +
								'' +
								'한글검색기능은 다른 데이터베이스를 이용하는 것이 아닌, \n\n' +
								'' +
								'인도네시아어 데이터베이스에서 검색하신 단어를 \n' +
								'결과로 포함하는 것에 대응하는 인니어를 찾는 기능이므로,\n\n' +
								'' +
								'간혹 검색결과가 맞지않아 보이는 경우가 있습니다.\n\n' +
								'' +
								'단어를 검색하시고 리스트에서 인니어를 직접 클릭하여\n' +
								'맞는 단어인지 꼭 확인하시고 사용해주시기 바랍니다.',
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
				itemClick: function($event){
					this.$parent.$parent.getVocaMean(this.item.ID, 'id');
					if(this.$parent.$parent.data.vocalist.active)
						this.$parent.$parent.data.vocalist.active.removeClass('active');
					this.$parent.$parent.data.vocalist.active = $($event.target);
					this.$parent.$parent.data.vocalist.active.toggleClass('active');
					var self = this;
					setTimeout(function(){
						self.$parent.$parent.$apply();
					},0);
				},
				index: 'in',
				list: [],
				allList: [],
				specList: []
			}
		}
	}];
});
