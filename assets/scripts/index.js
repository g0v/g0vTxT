$(document).ready(function ()
{
    d3.xhr("http://g0v-communique-api.herokuapp.com/api/2.0/hackpadData", "application/json", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            // console.log(data.response);
            var hackpadDate = JSON.parse(data.response);

            var parseDate = d3.time.format("%Y-%m-%d");

            hackpadDate.forEach(function (value) {
                var dateString = value.date.slice(0, 4) + '-' + value.date.slice(4, 6) + '-' + value.date.slice(6,8);
                value.date = parseDate.parse(dateString);
            });

            var margin = {top: 20, right: 20, bottom: 20, left: 20};
            var width = 1200 - margin.left - margin.right;
            var height = 400 - margin.top - margin.bottom;

            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom");
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
                transform: "translate(0, " + height + ")"
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
    });
});
