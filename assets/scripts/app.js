
angular.module('g0vTxT', ['ngRoute', 'controllers'])

.config(function($routeProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);
        $routeProvider
            .when('/home', {
              templateUrl: '/views/about.html'
            })
            .when('/visualize', {
                templateUrl: '/views/visualize.html'
            })
            .when('/hackpadViewer', {
                templateUrl: '/views/hackpadViewer.html',
                controller: 'ListCtrl'
            })
            .when('/communiqueViewer', {
                templateUrl: '/views/communiqueViewer.html',
                controller: 'CommuniqueViewrCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
})

.run(function($rootScope){
});
