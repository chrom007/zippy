angular.module("zippyApp").controller('faqController', ['$scope', function($scope){
	$scope.$on('$viewContentLoaded', function() {
		// IF ELEMENT EXIST (ThisPage == FAQ)
		if ( $(".faq_list") ) {
			$(".faq_list .item .ask").click(function(){
				$(this).parent().toggleClass("open");
				$(this).parent().find(".answer").toggle("slow");
			});
		}
	});
}]);