angular.module("zippyApp").controller('accountController', ['$scope', '$rootScope', 'API', function($scope, $rootScope, API){
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
			var image = null
			reader.readAsDataURL(file);
			reader.addEventListener("load", function () {
				image = reader.result;
		  	}, false);

			API.accountAvatar(token, avatar).then(function(data){
				console.log(data);
				$(".account .avatar .image div").css("backgroundImage", "url(" + image + ")")
			}, function(error){
				console.log("ERROR upload. Code: " + error.status);
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

}]);