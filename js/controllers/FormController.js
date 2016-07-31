angular.module('AllGiftedApp').controller('LearnFormController', function($scope, $http) {	
    $scope.role = [6];
  //      $scope.array_ = angular.copy($scope.array);
  	$scope.enrol = {};
  	$scope.enrol.roles = $scope.role;
	$scope.processEnrol = function() {
	 	$http.post('http://quizapi.pamelalim.me/houses/'+$scope.enrol.house_id+'/users', $scope.enrol)
	 	.then(function(response) {
			delete $scope.learnformsuccess;
			delete $scope.learnerrormsg;
	 		response.data.message.length>0 ? $scope.learnformsuccess=response.data.message: null;
	 		response.data.errormessage.length>0 ? $scope.learnerrormsg = response.data.errormessage: null;
	 		$scope.user = response.data;
    	}, function(err) {
    		$scope.errormsg = err.data.message;
    	});
    }
})

.controller('TeachFormController', function($scope, $http) {	
	$scope.house = {};
	$scope.processTeach = function() {
	 	$http.post('http://api.japher.org/houses', JSON.stringify($scope.house)).then(function(response) {
	 		delete $scope.teacherrormsg;
	 		response.data.message.length>0 ? $scope.teachformsuccess=response.data.message: null;
	 		response.data.errormessage.length>0 ? $scope.teacherrormsg = response.data.errormessage: null;
	 		$scope.formsuccess=response.data.message;
	 		$scope.user = response.data;
    	}, function(err) {
    		$scope.teacherrormsg = err.data.message;
    	});
    }
});
