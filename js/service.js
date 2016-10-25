app.service('API', function($http){
	var url = "http://26756.s.t4vps.eu";

	return {

		signin: function(login, password) {
			return $http({
				url: url + "/api/v1/auth/token/",
				method: "POST",
				data: {email: login, password}
			})
		},

		signup: function(login, password) {
			return $http({
				url: url + "/api/v1/auth/signup/",
				method: "POST",
				data: {email: login, password}
			})
		},

		search: function(params, token) {
			var status = params.status;
			var radius = params.radius;

			return $http({
				url: url + "/api/v1/client/vendors/",
				method: "GET",
				headers: {
					Authorization: "Token " + token,
				},
				params: {status: status, radius: radius}
			}).success(function(data){
				console.log(data);
			});
		}


	}
});