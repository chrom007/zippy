// Declare app level module which depends on views, and components
var depends = [
  'ngRoute'
];

angular.module('zippyApp', depends).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'views/home.html',
		controller : 'homeController'
	})
	.when('/contact', {
		templateUrl: 'views/contact.html'
	})
	.when('/about', {
		templateUrl: 'views/about.html'
	})
	.when('/account', {
		templateUrl: 'views/account.html',
		controller : 'accountController'
	})
	.when('/faq', {
		templateUrl: 'views/faq.html',
		controller: 'faqController'
	})
	.when('/signin', {
		templateUrl: 'views/signin.html',
		controller: 'signinController'
	})
	.when('/signup', {
		templateUrl: 'views/signup.html',
		controller: 'signupController'
	})
	.when('/search', {
		templateUrl: 'views/search.html',
		controller: 'searchController'
	})
	.when('/vendordash', {
		templateUrl: 'views/vendor_dashboard.html'
	})
	.when('/customdash', {
		templateUrl: 'views/customer_dashboard.html'
	})
	.otherwise({
		redirectTo: '/'
	});

	// use the HTML5 History API
	$locationProvider.html5Mode(true);
}]);


