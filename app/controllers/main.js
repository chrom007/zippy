angular.module('zippyApp').controller('mainController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
	$scope.loggined = false;
	$scope.user_login = null;
	$rootScope.token = null;
	$scope.api_url = "http://26756.s.t4vps.eu";
	$scope.api_img = "http://26756.s.t4vps.eu/api/v1/client";

		var date = new Date();
		var timestamp = Math.floor(date.getTime() / 1000);


	$scope.$on("loggined", function(event, data){
		$scope.loggined = data.loggined;
		$scope.user_login = data.login;
		$rootScope.token = data.token;
		$location.path("/account");

		localStorage.token = data.token;
		localStorage.token_end = timestamp + (10 * 60);
	});

	$scope.logout = function() {
		var host = document.location.host;
		localStorage.removeItem("token");
		document.location.href = "//" + host;
	};

	// SAVE / RESTORE / CLOSE TOKEN SESSION 
	if (localStorage.token != undefined) {
		$rootScope.token = localStorage.token;
		$scope.loggined = true;

		if (localStorage.token_end < timestamp) {
			$scope.logout();
		}
	}
}]);