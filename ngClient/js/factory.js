myApp.factory('dataFactory', function($http) {
  /** https://docs.angularjs.org/guide/providers **/
  var urlBase = 'http://localhost:8080/api/bears';
  var _prodFactory = {};

  _prodFactory.getProducts = function() {
    return $http.get(urlBase);
  };

  return _prodFactory;
});