function CommuniqueCtrl($scope, $http, $element) {
  $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/tags/all', {
    headers: {'Content-type': 'application/json'}})
  .success(function (data) {
    $scope.tagList = data;
  })

  $scope.showCommunique = function (tagName) {
    $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/' + tagName, {
      headers: {'Content-type': 'application/json'}})
    .success(function (data) {
      // $element.find('#showCommunique').html = data.content;
      $scope.communiqueTitle = tagName;
      $scope.communiqueList = data;
      // console.log(data);
    })
  }
  console.log("test");
}
