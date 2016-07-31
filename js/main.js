/***
AllGifted AngularJS App Main Script
***/

/* AllGifted App */
var AllGiftedApp = angular.module("AllGiftedApp", [
"auth0", "angular-storage", "angular-jwt",
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",
    "ngResource",  
    "ngSanitize",
    "datatables"
])

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}])

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}])

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout4',
    };

    $rootScope.settings = settings;

    return settings;
}])

/*-----------------------------------
| User Services
------------------------------------*/

.factory('users', function($resource){
    var resource = $resource('http://localhost:8000/users/:id', {id: '@id'}, {
        update: {method: 'PUT'}
    });
    return {
        get: function(success, error){
            return resource.query();
        },
        find: function(id, success, error){
            return resource.get({id: id}, success, error);
        },
        create: function(){
            return new resource();
        },
        destroy: function(id, success, error){
            resource.delete({id: id});
        }
    };
})

/* Setup App Main Controller */
.controller('AppController', ['$scope', '$rootScope', 'users','auth','store', '$location','$http', function($scope, $rootScope, users, auth, store, $location, $http) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });

    $scope.auth = auth;
    
    $http.get('http://localhost:8000/api/protected').then(function(response){
        $scope.now = new Date();
        $scope.user = response.data.user;
        $scope.statuses = response.data.statuses;
        $scope.houses = response.data.houses;
        $scope.courses = response.data.courses;
        $scope.roles = response.data.roles;
        $scope.logs = response.data.logs;
        $scope.correctness = response.data.correctness;
        store.set('allgiftedmathuser',$scope.user);
        $scope.profile = store.get('profile');
        $location.path('/dashboard');
    });

    $scope.login = function() {
    // The auth service has a signin method that
    // makes use of Auth0Lock. If authentication
    // is successful, the user's profile and token
    // are saved in local storage with the store service
        auth.signin({
            title: "Login me in",
            gravatar:false,
            icon: "http://www.all-gifted.com/images/allgifted-smalllogo.jpg",
            authParams: {
                scope: 'openid email name picture' 
            }
        }, function(profile, token) {
            store.set('profile', profile);
            store.set('token', token);
            $http.get('http://localhost:8000/api/protected').then(function(response) {
                //$rootScope.user = response.data;
                store.set('allgiftedmathuser', response.data.user);
                $scope.user = store.get('allgiftedmathuser');
                $scope.profile = store.get('profile');
                $scope.roles = response.data.roles;
                $scope.houses = response.data.houses;
                $scope.courses = response.data.courses;
                $scope.statuses = response.data.statuses;
                $scope.logs = response.data.logs;
                $scope.correctness = response.data.correctness;
                $location.path('/dashboard');
            });
        }, function(error) {
           console.log(error);
           })
    };

    $scope.logout = function() {
    // The signout method on the auth service
    // sets isAuthenticated to false but we
    // also need to remove the profile and
    // token from local storage
        auth.signout();
          store.remove('profile');
          store.remove('token');
          store.remove('allgiftedmathuser');
          $location.path('/');
    };


}])

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
.controller('HeaderController', ['$scope', '$http','auth', 'store', '$location', function($scope, $http, auth, store, $location) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

}])

/* Setup Layout Part - Sidebar */
.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}])

/* Setup Layout Part - Sidebar */
.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}])

/* Setup Layout Part - Quick Sidebar */
.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}])

/* Setup Layout Part - Theme Panel */
.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}])

/* Setup Layout Part - Footer */
.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}])

/* Setup Rounting For All Pages */

.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, $locationProvider,
  jwtInterceptorProvider) {

    // Redirect any unmatched url
        $urlRouterProvider.otherwise("/dashboard");
    
        $stateProvider

        .state('home', {
          url: '/home',
          data: {pageTitle: 'Home'},
          templateUrl: 'tpl/home.html'
        })

        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Dashboard'},
            controller: "DashboardController",
            resolve: {
/*                dashboardinfo: ['$http','$route', function($http, $route){
                  return $http.get('http://localhost:8000/api/protected')
                  .then(function(response){
                    return response.data;
                  })
              }],
*/                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AllGiftedApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/js/package/amcharts.js',
                            'assets/js/package/radar.js',
                            'assets/css/package/bootstrap-modal-bs3patch.css',
                            'assets/css/package/bootstrap-modal.css',
                            'assets/css/package/bootstrap-datepicker3.css',
                            'assets/css/package/select.min.css',

 
                            'assets/js/package/table-datatables-managed.min.js',
                            'assets/js/package/bootstrap-modalmanager.js',
                            'assets/js/package/bootstrap-modal.js',
                            'assets/js/package/bootstrap-datepicker.js',
                            'assets/js/package/select.min.js',
                            'assets/js/package/jquery-ui.min.js',
                            'assets/js/package/bootstrap-tabdrop.js',
                            'assets/js/theme/components-date-time-pickers.min.js',
                            'assets/js/theme/dashboard.min.js',
                            'js/controllers/DashboardController.js',
                            'js/controllers/FormController.js',
                            'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML'
                        ],
                    });
                }],
            }
        })

        // Class Page
        .state('housesDetail', {
            url: "/houses/:houseID",
            templateUrl: "views/houses.html",
            data: {pageTitle: 'Classes'},
            controller: "HouseController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AllGiftedApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [                             
                            'assets/css/package/datatables.min.css', 
                            'assets/css/package/datatables.bootstrap.css',

                            'assets/js/package/datatables.all.min.js',
                            'assets/js/package/table-datatables-managed.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })


        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AllGiftedApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/css/package/bootstrap-fileinput.css',
                            'assets/css/package/profile.css',
                            
                            'assets/js/package/jquery-sparkline.min.js',
                            'assets/js/package/bootstrap-fileinput.js',

                            'assets/js/package/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        jwtInterceptorProvider.tokenGetter = function(store) {
          return store.get('token');
        }

        $httpProvider.interceptors.push('jwtInterceptor');
        
        authProvider.init({
            domain: 'pamelalim.auth0.com',
            clientID: 'eVJv6UFM9GVdukBWiURczRCxmb6iaUYG',
            loginUrl: '/login'
        });  
})


/* Init global settings and run the app */
.run(["$rootScope", "settings", "$state","auth", "store", "jwtHelper", "$location", function($rootScope, settings, $state,auth, store, jwtHelper, $location) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    auth.hookEvents();

    $rootScope.$on('$locationChangeStart', function() {
      // Get the JWT that is saved in local storage
      // and if it is there, check whether it is expired.
      // If it isn't, set the user's auth state
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token);
          }
        }
      }
      else {
        // Otherwise, redirect to the home route
        $location.path('/home');
      }
    });

}])

.controller('HouseController', ['$resource', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder','$stateParams',function($resource, $scope, DTOptionsBuilder, DTColumnDefBuilder,$stateParams) {

    var vm = this;
    $scope.currentHouse = $scope.user.enrolled_classes[$stateParams.houseID];
    vm.tracks = $scope.user.enrolled_classes[$stateParams.houseID].tracks;
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];
    vm.track2Add = _buildTrack2Add(1);
    vm.addTrack = addTrack;
    vm.modifyTrack = modifyTrack;
    vm.removeTrack = removeTrack;
    
    function _buildTrack2Add(id) {
        return {
            level_id: id,
            track: 'Foo' + id,
            description: 'Bar' + id
        };
    }
    function addTrack() {
        vm.tracks.push(angular.copy(vm.track2Add));
        vm.track2Add = _buildTrack2Add(vm.track2Add.level_id + 1);
    }
    function modifyTrack(index) {
        vm.tracks.splice(index, 1, angular.copy(vm.track2Add));
        vm.track2Add = _buildTrack2Add(vm.track2Add.id + 1);
    }
    function removeTrack(index) {
        vm.tracks.splice(index, 1);
    }
}]);