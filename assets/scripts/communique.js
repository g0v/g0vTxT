
angular.module('communique', [])

.controller('CommuniqueCtrl', function ($scope, $http, $sce) {
    $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/tags/all', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        $scope.tagList = data;
        $scope.tagList.splice(0, 0, {
            name: "all",
            description: "",
            urls: []
        });
    });

    $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/all?limit=50', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        $scope.communiqueTitle = 'All';
        $scope.communiqueList = replaceURL(data, $sce);
    })

    $scope.showCommunique = function (tagName) {
        $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/' + tagName, {
            headers: {'Content-type': 'application/json'}})
        .success(function (data) {
            $scope.communiqueTitle = tagName;
            $scope.communiqueList = replaceURL(data, $sce);
        });
    }
    console.log("communique test");
})

.run(function($rootScope) {
});

function replaceURL (data, $sce) {
    data.forEach(function (entry) {
        var tmpString = entry.content;
        entry.urls.forEach(function (url) {
            tmpString = tmpString.replace(url.name, '<a target="_blank" href="' + url.url + '">' + url.name + '</a>');
        });
        entry.content = $sce.trustAsHtml(tmpString);
    });
    return data;
};
