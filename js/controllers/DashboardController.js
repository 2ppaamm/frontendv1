angular.module('AllGiftedApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $timeout(function() {
		var chartradar = AmCharts.makeChart("chartradar", {
		    "type": "radar",
		    "theme": "none",
		    "dataProvider":$scope.user.maxile,
		    "valueAxes": [{
		        "axisTitleOffset": 20,
		        "minimum": 0,
		        "axisAlpha": 0.15
		    }, {
		        "id": "v2",
		        "axisTitleOffset": 20,
		        "minimum": 0,
		        "axisAlpha": 0,
		        "inside": true
		    }],
		    "startDuration": 2,
		    "graphs": [{
		        "balloonText": "[[value]] last year's score",
		        "bullet": "round",
		        "fillAlphas": 0.3,
		        "valueField": "lastyear"
		    }, {
		        "balloonText": "[[value]] latest score",
		        "bullet": "round",
		        "fillAlphas": 0.3,
		        "valueField": "field_maxile",
		        "valueAxis": "v2"
		    }],
		    "categoryField": "field"
		});
    }, 5000);   
});