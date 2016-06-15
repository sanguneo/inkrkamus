/* global define */
define([], function() {
	var $compileProvider;
	var directivesList = [];

	/**
	* 컴파일 프로바이더 셋팅
	* @method setCompileProvider
	* @param {아직모름} value - value
	*/
	function setCompileProvider(value) {
		$compileProvider = value;
	}

	/**
	* 레지스터
	* @method register
	* @param {아직모름} directive - directive
	*/
	function register(directive) {
		if (directive) {
			if (!$compileProvider) {
				throw new Error('$compileProvider is not set!');
			}
			if (directivesList.indexOf(directive[0]) === -1) {
				$compileProvider.directive.apply(null, directive);
			}
			directivesList.push(directive[0]);
		} else {
			$compileProvider.directive.apply = null;
		}
	}

	return {
		setCompileProvider: setCompileProvider,
		register: register
	};
});
