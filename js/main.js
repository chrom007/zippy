
var app = angular.module("zippyApp", ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {

	$routeProvider
	.when('/', {
		templateUrl : 'templates/home.html',
		controller : 'homeController'
	})
	.when('/contact', {
		templateUrl: 'templates/contact.html'
	})
	.when('/about', {
		templateUrl: 'templates/about.html'
	})
	.when('/account', {
		templateUrl: 'templates/account.html',
		controller : 'accountController'
	})
	.when('/faq', {
		templateUrl: 'templates/faq.html',
		controller: 'faqController'
	})
	.when('/signin', {
		templateUrl: 'templates/signin.html',
		controller: 'signinController'
	})
	.when('/signup', {
		templateUrl: 'templates/signup.html',
		controller: 'signupController'
	})
	.when('/search', {
		templateUrl: 'templates/search.html',
		controller: 'searchController'
	})
	.when('/vendordash', {
		templateUrl: 'templates/vendor_dashboard.html'
	})
	.when('/customdash', {
		templateUrl: 'templates/customer_dashboard.html'
	})
	.otherwise({
		redirectTo: '/'
	});

	// use the HTML5 History API
	$locationProvider.html5Mode(true); 
});



//////////////////////////////////////////////////////////////
//					    MAIN controller 					//
//////////////////////////////////////////////////////////////

app.controller('mainController', function($scope, $rootScope, $location){
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

});

app.controller('homeController', function($scope){
	// HOME PAGE
});



//////////////////////////////////////////////////////////////
//					   SIGNIN controller 					//
//////////////////////////////////////////////////////////////

app.controller('signinController', function($scope, $rootScope, API){
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
});


//////////////////////////////////////////////////////////////
//					   SIGNUP controller 					//
//////////////////////////////////////////////////////////////

app.controller('signupController', function($scope, $rootScope, API, $location){
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
});



//////////////////////////////////////////////////////////////
//					   SEARCH controller 					//
//////////////////////////////////////////////////////////////

app.controller('searchController', function($scope, $rootScope, API){
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
});



//////////////////////////////////////////////////////////////
//						FAQ controller 						//
//////////////////////////////////////////////////////////////

app.controller('faqController', function($scope){
	$scope.$on('$viewContentLoaded', function() {
		// IF ELEMENT EXIST (ThisPage == FAQ)
		if ( $(".faq_list") ) {
			$(".faq_list .item .ask").click(function(){
				$(this).parent().toggleClass("open");
				$(this).parent().find(".answer").toggle("slow");
			});
		}
	});
});




//////////////////////////////////////////////////////////////
//					   ACCOUNT controller 					//
//////////////////////////////////////////////////////////////

app.controller('accountController', function($scope, $rootScope, API){
	var token = $rootScope.token;
	

	$scope.$on('$viewContentLoaded', function() {
		// GET ACCOUNT DETAILS
		if ($rootScope.token != null) {
			API.accountGet(token).then(function(accountData){
				console.log(accountData);
				$scope.account = accountData.data.data;
				$scope.account.type = String($scope.account.type);

				var avatar = $scope.api_img + $scope.account.avatar_url;
				$(".account .avatar .image div").css("backgroundImage", "url(" + avatar + ")");
			});
		}
		else {
			var host = document.location.host;
			localStorage.removeItem("token");
			document.location.href = "//" + host;
		};

		// EDIT BUTTON EVENT
		$(".account .item .edit").click(function(){
			var input = $(this).parent().find("input");
			if (input.length == 0) input = $(this).parent().find("select");
			var disabled = input.prop('disabled');
			input.prop('disabled', !disabled);
			input.toggleClass("editable");
			input.focus();

			if (!input.hasClass("select")) {
				var length = input.val().length;
				input[0].setSelectionRange(length, length); 
			}
		});

		// BLUE EVENT INPUTS
		$(".account .item input").blur(function(){
			$(this).removeClass("editable");
			$(this).prop('disabled', true);
		});

		// AVATAR LOAD FROM FILE AND UPLOAD
		$("#file_avatar").change(function(){
			var file = $('#file_avatar')[0].files[0];
			$scope.avatar.append('avatar', file);
			
			var avatar = $scope.avatar;
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.addEventListener("load", function () {
				$(".account .avatar .image div").css("backgroundImage", "url(" + reader.result + ")");
		  	}, false);

			API.accountAvatar(token, avatar).then(function(data){
				console.log(data);
			});
		});
	});

	$scope.account = {
		first_name: "",
		last_name: "",
		address: "",
		phone: "",
		alt_phone: "",
		pay_pal: "",
		type: "1",
		zip_code: ""
	};

	$scope.avatar = new FormData();


	// SAVE ACCOUNT INFO
	$scope.save = function() {
		API.accountSave(token, $scope.account).then(function(data){
			console.log(data);

			if (data.data.error == null) {
				$(".account .info .save .success").addClass("true");
				setTimeout(function(){
					$(".account .info .save .success").removeClass("true");
				}, 2000);
			}
		});
	};


	$scope.avatarSave = function() {
		$("#file_avatar").click();
	};

});