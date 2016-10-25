
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
		templateUrl: 'templates/account.html'
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
	.otherwise({
		redirectTo: '/'
	});

	// use the HTML5 History API
	$locationProvider.html5Mode(true); 
});

app.controller('mainController', function($scope, $rootScope, $location){
	$scope.loggined = false;
	$scope.user_login = null;
	$rootScope.token = null;


	$scope.$on("loggined", function(event, data){
		$scope.loggined = data.loggined;
		$scope.user_login = data.login;
		$rootScope.token = data.token;
		$location.path("/account");
	});

	$scope.logout = function() {
		var host = document.location.host;
		document.location.href = "//" + host;
	};
});

app.controller('homeController', function($scope){
	// HOME PAGE
});

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


app.controller('searchController', function($scope, $rootScope, API){
	$scope.params = {
		status: null,
		radius: 0
	};

	$scope.search = function() {
		API.search($scope.params, $rootScope.token).then(function(data){
			console.log(data)
		});
	};
});


app.controller('faqController', function($scope){
	$scope.$on('$viewContentLoaded', function() {
		// IF ELEMENT EXIST (ThisPage - FAQ)
		if ( $(".faq_list") ) {
			$(".faq_list .item .ask").click(function(){
				$(this).parent().toggleClass("open");
				$(this).parent().find(".answer").toggle("slow");
			});
		}
	});
});