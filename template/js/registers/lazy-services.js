define([], function() {
	var $provide;
	/**
	* 프로바이드
	* @method setProvide
	* @param {아직모름} value - value
	*/
	function setProvide(value) {
		$provide = value;
	}

	/**
	* 프로바이드
	* @method register
	* @param {아직모름} service - service
	*/
	function register(service) {
		if (service) {
			if (!$provide) {
				throw new Error('$setProvide is not set!');
			}
			$provide.value(service[0], service[1]);
		} else {
			$provide.value = null;
		}
	}

	return {
		setProvide: setProvide,
		register: register
	};
});
