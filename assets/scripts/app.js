
angular.module('g0vTxT', ['ngRoute'])

.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
              templateUrl: 'views/about.html'
            })
            .when('/visualize', {
                templateUrl: 'views/visualize.html'
            })
            .when('/hackpadViewer', {
                templateUrl: 'views/hackpadViewer.html',
                controller: 'ListCtrl'
            })
            .when('/communiqueViewer', {
                templateUrl: 'views/communique.html'
            })

            .otherwise('/');
        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
}])
