/* global define */
'use strict';

define(['joutside'], function () {
	return ['combobox', function () {
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/combobox.html',
			replace: 'true',
			scope: {
				data: '=cbData'
			},
			controller: ['$scope','$element', '$timeout', function ($scope, $element, $timeout) {
				$scope.element = $element;
$element.bind( "clickoutside", function(event){
	$element.find('.dropdown').slideUp();
	$element.find('i').removeClass('active')
});
				var toggler = function() {
					$element.find('.dropdown').slideToggle();
					$element.find('i').toggleClass('active')
				}
				$timeout(function(){
				new formplate({
					selector: '#' + $scope.data.id + ' > .form-el'
				});});
				if ($scope.data.itemClick) {
					$scope.itemClick = $scope.data.itemClick;
				}else {
					$scope.data.value = $scope.data.list[$scope.data.selected];
				$scope.itemClick = function() {
					$scope.data.selected = this.$index;
					$scope.data.value = $scope.data.list[$scope.data.selected];
					toggler();
				}
			}

			$scope.toggler = toggler;
				$scope.activate = function() {
					inputDropDown();
					toggler();
				}
				$scope.activateInput = function() {
					if (!$scope.data.readonly && $element.find('.dropdown').css('display') !== 'none') {
						toggler();
					}
					if (!$scope.data.readonly) return;
					inputDropDown();
					toggler();
				}
				var inputDropDown = function () {
					var InputForm = $element.find('input')[0].getBoundingClientRect();
					 $element.find('.dropdown').css({
					 	top: (InputForm.top + InputForm.height) + 'px',
					 	left: InputForm.left + 'px',
					 	width: InputForm.width + 'px',
						height: ((($scope.data.list.length - ($scope.data.readonly ? 1 : 0)) * 25) < 200 ? (($scope.data.list.length - ($scope.data.readonly ? 1 : 0)) * 25 + 1) : 200) + 'px'
					 })
				};
				if ($scope.data.resize) {
				$element.children('.form-el').resize(function(){
					inputDropDown();
				});
			} else {
				$(window).resize(function(){
					inputDropDown();
				});
			}
			}],
			link: function (/* scope (can be used.) */) {
				// $('#example').fadeIn(300);
			}
		};
	}];
});
