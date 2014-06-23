
angular.module('communique', [])

.controller('CommuniqueCtrl', function ($scope, $http, $sce) {
    $scope.dateList = [];
    $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/tags/all', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        $scope.allTagList = data;
        $scope.allTagList = replaceTagURL(data, $sce);
        $scope.allTagList.splice(0, 0, {
            name: "all",
            description: "",
            urls: []
        });
        $scope.tagList = $scope.allTagList;
    });

    $http.get('http://g0v-communique-api.herokuapp.com/api/1.0/entry/all', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        $scope.communiqueTitle = 'all';
        data.forEach(function (entry) {
            $scope.dateList = pushDate($scope.dateList, entry.date);
        });
        $scope.defaultDate = {
            year: '2014',
            month: 'g0v'
        };
        $scope.communiqueTagList = pushCommuniqueList(replaceURL(data, $sce), $scope.allTagList);
    })

    $scope.showCommunique = function (tagName) {
        $scope.communiqueTitle = tagName;
        var apiUrl = getPadUrl(tagName, $scope.defaultDate);
        $http.get(apiUrl, {
            headers: {'Content-type': 'application/json'}})
        .success(function (data) {
            var tmpList = pushCommuniqueList(replaceURL(data, $sce), $scope.allTagList);
            if (tagName != 'all') {
                $scope.communiqueTagList = tmpList.filter(function (entry) {
                    return entry.name == tagName;
                });
            } else {
                $scope.communiqueTagList = tmpList;
            }
        });
    }

    $scope.selectDate = function (date) {
        $scope.defaultDate = date;
        var apiUrl = getPadUrl('all', date);
        $http.get(apiUrl, {
            headers: {'Content-type': 'application/json'}})
        .success(function (data) {
            $scope.communiqueTagList = pushCommuniqueList(replaceURL(data, $sce), $scope.allTagList);
            $scope.tagList = $scope.communiqueTagList;
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

function replaceTagURL (data, $sce) {
    data.forEach(function (entry) {
        var tmpString = entry.description;
        for (var i = 0; i< entry.urls.length; i++) {
            var url = entry.urls[i];
            tmpString = tmpString.replace(url.name, '<a target="_blank" href="' + url.url + '">' + url.name + '</a>');
        }
        entry.description = $sce.trustAsHtml(tmpString);
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
    if (date.month == 'g0v') {
        apiUrl = 'http://g0v-communique-api.herokuapp.com/api/1.0/entry/' + tagName;
    }
    return apiUrl;
}

function pushCommuniqueList(communiqueData, tagList) {
    var newTagList = [];
    tagList.forEach(function (tagEntry) {
        var check = 0;
        var tmpTagEntry = tagEntry;
        tmpTagEntry.communiqueList = [];
        communiqueData.forEach(function (communiqueEntry) {
            if (communiqueEntry.tags.some(function (entry) {
                return entry == tagEntry.name;
            })) {
                check = 1;
                tmpTagEntry.communiqueList.push(communiqueEntry);
            }
        });
        if (check == 1) {
            newTagList.push(tmpTagEntry);
        }
    });
    return newTagList;
}

$(function () {
    $('.ui.dropdown').dropdown();
});

