myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
    function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
        //todo personalise user
        $scope.user = {
            username: 'user',
            password: 'user'
        };

        $scope.login = function() {
            var username = $scope.user.username,
                password = $scope.user.password;

            if (username !== undefined && password !== undefined) {
                UserAuthFactory.login(username, password).success(function(data) {
                    //We store the values in the AuthenticationFactory as well as sessionStorage
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user.username;
                    AuthenticationFactory.userRole = data.user.role;

                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.username;
                    $window.sessionStorage.userRole = data.user.role;
                    //Redirect the user to the home page.
                    $location.path("/");

                }).error(function(status) {
                    alert('Oops something went wrong!');
                });
            } else {
                alert('Invalid credentials');
            }

        };

    }
]);