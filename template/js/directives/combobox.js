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
			controller: ['$scope', '$element', '$timeout', function ($scope, $element, $timeout) {
				$timeout(function(){
					new formplate({
						selector: '#' + $scope.data.id + ' > .form-el'
					});
				});

				var dropdownStyler = function () {
					var InputForm = $element.find('input')[0].getBoundingClientRect();
					$element.find('.dropdown').css({
						top: (InputForm.top + InputForm.height) + 'px',
						left: InputForm.left + 'px',
						width: InputForm.width + 'px',
						height: ((($scope.data.list.length - ($scope.data.readonly ? 1 : 0)) * 25) < 200 ? (($scope.data.list.length - ($scope.data.readonly ? 1 : 0)) * 25 + 1) : 200) + 'px'
					})
				};
				$scope.toggler = function () {
					$element.find('.dropdown').slideToggle();
					$element.find('i').toggleClass('active')
				};

				$element.bind("clickoutside", function (event) {
					$element.find('.dropdown').slideUp();
					$element.find('i').removeClass('active')
				});


				if ($scope.data.itemClick) {
					$scope.itemClick = $scope.data.itemClick;
				} else {
					$scope.data.value = $scope.data.list[$scope.data.selected];
					$scope.itemClick = function () {
						$scope.data.selected = this.$index;
						$scope.data.value = $scope.data.list[$scope.data.selected];
						$scope.toggler();
					}
				}

				$scope.activate = function () {
					dropdownStyler();
					$scope.toggler();
				};
				$scope.activateInput = function () {
					if (!$scope.data.readonly && $element.find('.dropdown').css('display') !== 'none') {
						$scope.toggler();
					}
					if (!$scope.data.readonly) return;
					dropdownStyler();
					$scope.toggler();
				};

				if ($scope.data.resize) {
					$element.children('.form-el').resize(function () {
						dropdownStyler();
					});
				} else {
					$(window).resize(function () {
						dropdownStyler();
					});
				}
			}],
			link: function (/* scope (can be used.) */) {
				// $('#example').fadeIn(300);
			}
		};
	}];
});
