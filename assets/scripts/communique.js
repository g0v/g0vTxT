
angular.module('communique', [])

.controller('CommuniqueCtrl', function ($scope, $http, $sce) {
    $scope.dateList = [];
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

    $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/all', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        $scope.communiqueTitle = 'all';
        data.forEach(function (entry) {
            $scope.dateList = pushDate($scope.dateList, entry.date);
        });
        $scope.defaultDate = $scope.dateList[0];
        $scope.communiqueList = replaceURL(data, $sce);
    })

    $scope.showCommunique = function (tagName) {
        $scope.communiqueTitle = tagName;
        var apiUrl = getPadUrl(tagName, $scope.defaultDate);
        $http.get(apiUrl, {
            headers: {'Content-type': 'application/json'}})
        .success(function (data) {
            $scope.communiqueList = replaceURL(data, $sce);
        });
    }

    $scope.selectDate = function (date) {
        $scope.defaultDate = date;
        var apiUrl = getPadUrl($scope.communiqueTitle, date);
        $http.get(apiUrl, {
            headers: {'Content-type': 'application/json'}})
        .success(function (data) {
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

function pushDate (date, newDate) {
    var year = newDate.substring(0, 4);
    var month = newDate.substring(5, 7);
    var check = 0;
    date.forEach(function (entry) {
        if (year == entry.year && month == entry.month) {
            check = 1;
        }
    });
    if (check == 0) {
        date.push({
            year: year,
            month: month
        });
    }
    return date;
};

function getPadUrl (tagName, date) {
    var startDate = date.year + '\/' + date.month;
    var endDate = date.year + '\/' + date.month + '\/' + 31;
    var apiUrl = 'http://g0v-communique-api.herokuapp.com/api/1.0/entry/' + tagName + '?start=' + startDate + '&end=' + endDate;
    return apiUrl;
}

// function pushCommuniqueList(communiqueData, tagList) {
//     tagList.forEach(function (tagEntry) {
//         communiqueData.forEach(function (communiqueEntry) {
//             if (communiqueEntry.tags.some(tagEntry.name)) {
//                 tagEntry.communiqueList.push(communiqueEntry)
//             }
//         })
//     })
// }

$(function () {
    $('.ui.dropdown').dropdown();
});
