angular.module("zippyApp").service('API', function($http){
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
				params: {status, job_type: params.job_type}
			});
		},

		accountGet: function(token) {
			return $http({
				url: url + "/api/v1/client/profile/",
				method: "GET",
				headers: {
					Authorization: "Token " + token,
				}
			});
		},

		accountSave: function(token, account) {
			return $http({
				url: url + "/api/v1/auth/profile/",
				method: "POST",
				headers: {
					Authorization: "Token " + token
				},
				data: account
			});
		},

		accountAvatar: function(token, avatar) {
			return $http({
				url: url + "/api/v1/client/avatar/",
				method: "POST",	
				headers: {
					Authorization: "Token " + token,
					'Content-Type': undefined
				},
				data: avatar
			});
		},

		getJobTypes: function(token) {
			return $http({
				url: url + "/api/v1/client/job-types/",
				method: "GET",
				headers: {
					Authorization: "Token " + token
				}
			});
		}


	}
});