angular.module("zippyApp").controller('signupController', ['$scope', '$rootScope', 'API', '$location', function($scope, $rootScope, API, $location){
	$scope.login = null;
	$scope.password = null;
	$scope.password_2 = null;
	$scope.loggined = false;

	$scope.signup = function() {
		if ($scope.password == $scope.password_2) {
			API.signup($scope.login, $scope.password).then(function(data){
				// SUCCESS SIGNUP ACTION
				console.log(data);
				if (data.data.result == true) {
					$rootScope.login = $scope.login;
					$rootScope.password = $scope.password;

					$location.path("/signin");
					$rootScope.$broadcast("signup_success", {
						login: $scope.login,
						password: $scope.password
					});	
				}
			});
		}
		else alert("Пароли не совпадают!");
	};
}]);