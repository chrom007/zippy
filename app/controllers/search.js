angular.module("zippyApp").controller('searchController', ['$scope', '$rootScope', 'API', function($scope, $rootScope, API){
	$scope.$on('$viewContentLoaded', function() {
		if ($rootScope.token != null) {
			API.getJobTypes($rootScope.token).then(function(data){
				console.log(data);
				if (data.data.error == null) {
					var default_type = {
						id: null,
						title: '- Not Selected -'
					};

					$scope.types = data.data.data.job_types;
					$scope.types.unshift(default_type);
					$scope.search();
				}
			});
		}
		else {
			var host = document.location.host;
			localStorage.removeItem("token");
			document.location.href = "//" + host;
		};
	});

	$scope.params = {
		status: null,
		radius: 0,
		job_type: null
	};

	$scope.users = {};
	$scope.types = {};

	$scope.search = function() {
		API.search($scope.params, $rootScope.token).then(function(data){
			console.log(data.data);
			var users = data.data.data;
			if (users.length > 0) {
				$scope.users = users;
			}
			else {
				$scope.users = {};
			}
		});
	};

	// ADD selected CLASS TO AVERAGE STATUS
	$scope.avClass = function(thisStatus, status) {
		if (thisStatus == status) 
			return "selected";
	};
}]);