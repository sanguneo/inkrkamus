/* global define */
'use strict';

define(['mCustomScrollbar'], function () {
	/*
		data Example )
	 	itemlist: {
			id: 'itemlistId',
			name: 'itemlistName',
			itemClick: function(){
				console.log(this.item); // when use 'item in items', this = clickedItem
			},
			items: [foo, bar ...]
		}
	 */
	return ['listbox', function () {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/listbox.html',
			replace: 'true',
			scope: {
				data: '=lData'
			},
			controller: ['$scope','$element','$timeout', function ($scope, $element, $timeout) {
				$timeout(function(){
					$element.mCustomScrollbar({
								axis: 'y',
								autoHideScrollbar: false,
								theme: 'dark-thin',
								scrollbarPosition: 'inside',
								scrollButtons:{ enable: true }
							});}
				);
				$scope.itemClick = $scope.data.itemClick;
			}],
			link: function (/* scope (can be used.) */) {
				// $('#example').fadeIn(300);
			}
		};
	}];
});
