var myApp = angular.module('ngclient', ['ngRoute']);

//Use $httpProvider to change the default behavior of the $http service
myApp.config(function($routeProvider, $httpProvider) {

    //add custum header/token at every request
    $httpProvider.interceptors.push('TokenInterceptor');

    //what is access
    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            access: {
                requiredLogin: false
            }
        })
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl',
            access: {
                requiredLogin: true
            }
        }).when('/page1', {
            templateUrl: 'partials/page1.html',
            controller: 'Page1Ctrl',
            access: {
                requiredLogin: true
            }
        })
        .when('/page2', {
            templateUrl: 'partials/page2.html',
            controller: 'Page2Ctrl',
            access: {
                requiredLogin: true
            }
        }).when('/page3', {
            templateUrl: 'partials/page3.html',
            controller: 'Page3Ctrl',
            access: {
                requiredLogin: true
            }
        }).otherwise({
            redirectTo: '/login'
        });
    });
    //get executed after the injector is created and are used to kickstart the application. Only instances and constants can be injected into run blocks.
    myApp.run(function($rootScope, $window, $location, AuthenticationFactory) {
        // when the page refreshes, check if the user is already logged in
       AuthenticationFactory.check();
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
                $location.path("/login");
            } else {
                // check if user object exists else fetch it. This is incase of a page refresh
                if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
                if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            }
        });
        //Every application has a single root scope.
        //All other scopes are descendant scopes of the root scope.
        //$on : Listens on events of a given typ
        $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
            $rootScope.showMenu = AuthenticationFactory.isLogged;
            $rootScope.role = AuthenticationFactory.userRole;
            // if the user is already logged in, take him to the home page
            if (AuthenticationFactory.isLogged === true && $location.path() === '/login') {
                $location.path('/');
            }
        });
    });
