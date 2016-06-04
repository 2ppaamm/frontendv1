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
		        "balloonText": "[[value]] current score",
		        "bullet": "round",
		        "fillAlphas": 0.3,
		        "valueField": "highest"
		    }, {
		        "balloonText": "[[value]] last year's",
		        "bullet": "square",
		        "valueField": "latest",
		        "valueAxis": "v2"
		    }],
		    "categoryField": "track"
		});

		var chart = AmCharts.makeChart("chartdash1", {
		    "type": "serial",
		    "rotate": true,
		    "theme": "light",
		    "autoMargins": false,
		    "marginTop": 30,
		    "marginLeft": 80,
		    "marginBottom": 30,
		    "marginRight": 50,
		    "dataProvider": [{
		        "category": "DashPoints",
		        "full": $scope.user.highest_scores.highest_game,
		        "limit": $scope.user.highest_scores.average_game,
		        "bullet": $scope.user.game_level
		    }],
		    "valueAxes": [{
		        "maximum": $scope.user.highest_scores.highest_game,
		        "stackType": "regular",
		        "gridAlpha": 0
		    }],
		    "startDuration": 1,
		    "graphs": [{
		        "valueField": "full",
		        "showBalloon": false,
		        "type": "column",
		        "lineAlpha": 0,
		        "fillAlphas": 0.8,
		        "fillColors": [ "#19d228","#f6d32b","#fb2316"],
		        "gradientOrientation": "horizontal",
		    }, {
		        "clustered": false,
		        "columnWidth": 0.3,
		        "fillAlphas": 1,
		        "lineColor": "#000000",
		        "stackable": false,
		        "type": "column",
		        "valueField": "bullet"
		    },{
		        "columnWidth": 0.5,
		        "lineColor": "#000000",
		        "lineThickness": 3,
		        "noStepRisers": true,
		        "stackable": false,
		        "type": "step",
		        "valueField": "limit"
		    }],
		    "columnWidth": 1,
		    "categoryField": "category",
		    "categoryAxis": {
		        "gridAlpha": 0,
		        "position": "left"
		    }
		});	

		var chart = AmCharts.makeChart("chartdash2", {
		    "type": "serial",
		    "rotate": true,
		    "theme": "light",
		    "autoMargins": false,
		    "marginTop": 30,
		    "marginLeft": 80,
		    "marginBottom": 30,
		    "marginRight": 50,
		    "dataProvider": [{
		        "category": "Maxile",
		        "limit": 1250, 					// target
		        "full": 1300,
		        "bullet": $scope.user.maxile_level
		    }],
		    "valueAxes": [{
		        "maximum": 1300,
		        "stackType": "regular",
		        "gridAlpha": 0
		    }],
		    "startDuration": 1,
		    "graphs": [{
		        "valueField": "full",
		        "showBalloon": false,
		        "type": "column",
		        "lineAlpha": 0,
		        "fillAlphas": 0.8,
		        "fillColors": [ "#fb2316","#19d228","#f6d32b"],
		        "gradientOrientation": "horizontal",
		    }, {
		        "clustered": false,
		        "columnWidth": 0.3,
		        "fillAlphas": 1,
		        "lineColor": "#000000",
		        "stackable": false,
		        "type": "column",
		        "valueField": "bullet"
		    },{
		        "columnWidth": 0.5,
		        "lineColor": "#000000",
		        "lineThickness": 3,
		        "noStepRisers": true,
		        "stackable": false,
		        "type": "step",
		        "valueField": "limit"
		    }],
		    "columnWidth": 1,
		    "categoryField": "category",
		    "categoryAxis": {
		        "gridAlpha": 0,
		        "position": "left"
		    }
		});	

    }, 2000);   
});