
angular.module('controllers', [])

.controller('menuCtrl', function ($scope) {

    $scope.home   = 'active item';
    $scope.visual = 'item';
    $scope.hView  = 'item';
    $scope.cView  = 'item';

    $scope.changeClass = function (item) {
        $scope.home   = 'item';
        $scope.visual = 'item';
        $scope.hView  = 'item';
        $scope.cView  = 'item';
        switch(item) {
        case 'home':
            $scope.home = 'active item';
            break;
        case 'visual':
            $scope.visual = 'active item';
            break;
        case 'hView':
            $scope.hView = 'active item';
            break;
        case 'cView':
            $scope.cView = 'active item';
            break;
        default:
            break;
        }
    };
})

.controller('ListCtrl', function ($scope, $http, $sce) {
    $http.get('http://g0v-communique-api.herokuapp.com/api/2.0/hackpadList', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        $scope.padList = data;
    });

    $scope.showPad = function (padID) {
        // $element.find('.showPad').attr('src','https://g0v.hackpad.com/ep/pad/static/' + padID);
        $scope.padUrl = $sce.trustAsResourceUrl('https://g0v.hackpad.com/ep/pad/static/' + padID);
    };
    console.log("test");
})

.controller('CommuniqueViewrCtrl', function ($scope, $sce) {
    $scope.communiqueUrl = $sce.trustAsResourceUrl('./views/communique.html');
})

.controller('VisualCtrl', function ($scope, $http) {
    $scope.visualHackpad = "ui active inverted dimmer";
    $scope.visualAuthor = "ui active inverted dimmer";
    $http.get('http://g0v-communique-api.herokuapp.com/api/2.0/hackpadData', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        var maxNum = 0;
        var totalPad = 0;
        data.sort( function (a, b) {
            return a.date - b.date;
        });

        data.forEach (function (entry) {
            maxNum = maxNum < entry.num ? entry.num: maxNum;
            totalPad += entry.num;
        });

        $scope.firstDate   = data[0].date;
        $scope.highestDate = maxNum;
        $scope.totalPad    = totalPad;

        d3HackpadDataVisualize(data);
        $scope.visualHackpad = "ui disabled inverted dimmer";
    });

    $http.get('http://g0v-communique-api.herokuapp.com/api/2.0/hackpadAuthors', {
        headers: {'Content-type': 'application/json'}})
    .success(function (data) {
        var maxNum = 0;
        var totalEdit = 0;
        data.forEach (function (entry) {
            maxNum = maxNum < entry.editNum ? entry.editNum: maxNum;
            totalEdit += entry.editNum;
        });

        $scope.totalEdit = totalEdit;
        console.log(totalEdit);

        $scope.totalAuthor = data.length;

        d3AuthorsEditVisual(data);
        $scope.visualAuthor = "ui disabled inverted dimmer";
    });
})

.run(function($rootScope) {
});

function d3HackpadDataVisualize (hackpadDate) {
    var parseDate = d3.time.format("%Y-%m-%d");

    hackpadDate.forEach(function (value) {
        var dateString = value.date.slice(0, 4) + '-' + value.date.slice(4, 6) + '-' + value.date.slice(6,8);
        value.date = parseDate.parse(dateString);
    });

    var margin = {top: 20, right: 20, bottom: 20, left: 40};
    var width = 1100 - margin.left - margin.right;
    var height = 150 - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%y/%m"));
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var line = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.num); });

    var svg = d3.select(".padTime").append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

    x.domain(d3.extent(hackpadDate, function (d) { return d.date; }));
    y.domain(d3.extent(hackpadDate, function (d) { return d.num; }));

    svg.append("g").attr({
        class: "x axis",
        transform: "translate(0," + height + ")"
    }).call(xAxis);

    svg.append("g").attr({
        class: "y axis"
    }).call(yAxis)
    .append("text").attr({
        transform: "rotate(-90)",
        y: 6,
        dy: ".70em",
        "text-anchor": "end"
    }).text("Create Number");

    svg.append("path").datum(hackpadDate).attr({
        class: "line",
        d: line
    });
}

function d3AuthorsEditVisual (authorsEdit) {
    authorsEdit = authorsEdit.filter(function (value) {
        return value.editNum > 10;
    });

    var dataNode =  {
        children: authorsEdit.map(function (value) {
            return {
                value: value.editNum,
                name: value.name
            };
        })
    };

    var d3Pack = d3.layout.pack().sort(function (a, b) { return b.value - a.value;})
        .size([1100, 1100]).padding(20).nodes(dataNode);

    d3Pack.shift();

    var colorScale = d3.scale.linear().domain([1, 1500]).range(["#0aa", "#0a5"]);

    var dataPack = d3.select(".authorsEdit").selectAll("circle.pack").data(d3Pack);
    dataPack.enter().append("circle").attr("class", "pack");

    d3.select(".authorsEdit").selectAll("circle.pack").attr({
        cx: function (d) { return d.x; },
        cy: function (d) { return d.y; },
        r: function (d) { return d.r; },
        fill: function (d) { return colorScale(d.value); },
        stroke: "#fff"
    });

    var dataText = d3.select(".authorsEdit").selectAll("text.pack").data(d3Pack);
    dataText.enter().append("text").attr("class", "pack");

    d3.select(".authorsEdit").selectAll("text.pack").attr({
        x: function (d) { return d.x; },
        y: function (d) { return d.y; },
        fill: "#fff",
        "text-anchor": "middle",
        "dominant-baseline": "central"
    }).text(function (d) {
        var ans = d.value > 30 ? d.name.substring(0, d.r/3.5) :"";
        return ans;
    });

    var dataNumText = d3.select(".authorsEdit").selectAll("text.numPack").data(d3Pack);
    dataNumText.enter().append("text").attr("class", "numPack");

    d3.select(".authorsEdit").selectAll("text.numPack").attr({
        x: function (d) { return d.x; },
        y: function (d) { return d.y + 15; },
        fill: "#fff",
        "text-anchor": "middle",
        "dominant-baseline": "central"
    }).text(function (d) {
        var ans = d.value > 50 ? d.value : "";
        return ans;
    });
}
