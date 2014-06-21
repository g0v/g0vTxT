function CommuniqueCtrl($scope, $http, $element) {
  $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/tags/all', {
    headers: {'Content-type': 'application/json'}})
  .success(function (data) {
    $scope.tagList = data;
  });

  $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/all?limit=50', {
    headers: {'Content-type': 'application/json'}})
  .success(function (data) {
    $scope.communiqueTitle = 'All';
    $scope.communiqueList = data;
  })

  $scope.showCommunique = function (tagName) {
    $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/' + tagName, {
      headers: {'Content-type': 'application/json'}})
    .success(function (data) {
      $scope.communiqueTitle = tagName;
      $scope.communiqueList = data;
    });
  }
  console.log("communique test");
}
