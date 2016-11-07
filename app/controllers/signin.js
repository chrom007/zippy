angular.module("zippyApp").controller('signinController', ['$scope', '$rootScope', 'API', function($scope, $rootScope, API){
	$scope.login = "psergeid@yandex.ru";
	$scope.password = "qwe";
	$scope.loggined = false;

	// SUCCESS SIGNUP ACTION
	$scope.$on("signup_success", function(event, data){
		$scope.login = data.login;
		$scope.password = data.password;
		$scope.signin();
	});

	// SUCCESS SIGNUP ACTION if SIGNIN page FIRST LOAD
	$scope.$on('$viewContentLoaded', function() {
		if ($rootScope.login) {
			$scope.login = $rootScope.login;
			$scope.password = $rootScope.password;
			$scope.signin();
		}
	});

	$scope.signin = function() {
		API.signin($scope.login, $scope.password).then(function(data){
			console.log(data);

			if (data.data.error == null && data.data.result == true) {
				$scope.loggined = true;

				$rootScope.$broadcast("loggined", {
	                loggined: $scope.loggined,
	                login: $scope.login,
	                token: data.data.data.token
	            });
			}
		});
	};
}]);