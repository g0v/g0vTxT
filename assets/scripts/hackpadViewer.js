
function ListCtrl($scope, $element) {
  $scope.padList = [{
      title: "Test",
      padID: "SfbYGspW4V0"
    },
    {
      title: "Test123",
      padID: "JWIizPuN3mz"
    }
  ]

  $scope.showPad = function (padID) {
    $element.find('.showPad').attr('src','https://g0v.hackpad.com/ep/pad/static/' + padID);
  }
  console.log("test");
}
