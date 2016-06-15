/* global define */
define([], function() {
	var $filterProvider;

	/**
	* 필터 프로바이더 셋팅
	* @method setFilterProvider
	* @param {아직모름} value - value
	*/
	function setFilterProvider(value) {
		$filterProvider = value;
	}

	/**
	* 레지스터 셋팅
	* @method register
	* @param {아직모름} filter - value
	*/
	function register(filter) {
		if (filter) {
			if (!$filterProvider) {
				throw new Error('$setProvide is not set!');
			}
			$filterProvider.register(filter[0], filter[1]);
		} else {
			$filterProvider.register = null;
		}
	}

	return {
		setFilterProvider: setFilterProvider,
		register: register
	};
});
