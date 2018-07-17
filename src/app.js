// Create main svg element
var chartDiv = document.getElementById("worldMap");
var svg = d3.select(chartDiv).append("svg");
var content = svg.append("g");

// Prepare path projection, width and height
var path = d3.geoPath(d3.geoMercator());

// Create tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// First draw of the graph
redraw();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);

function redraw() {
    var width = chartDiv.clientWidth;
    var height = width / 2;

    svg
        .attr("width", width)
        .attr("height", height)

    var zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", () => {
            content.attr("transform", d3.event.transform);
        });
    svg.call(zoom);

    // draw world map
    d3.json("./world-110m.json", (error, world) => {
        if (error) throw error;

        var geojson = topojson.feature(world, world.objects.countries)
        content.selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "country")

    });

    // draw meteorites
    d3.json("./meteorite-strike-data.json", (error, meteorite) => {
        if (error) throw error;

        var scale = d3.scaleSqrt().domain([0, 1000000]).range([2, 7]);
        var circlePath = path.pointRadius(m => scale(m.properties.mass))
        content.selectAll("path")
            .data(meteorite.features)
            .enter().append("path")
            .attr("d", circlePath)
            .attr("class", "meteor")
            .on("mouseover", d => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Name: " + d.properties.name + "<br />" +
                    "Mass: " + d.properties.mass + "<br />" +
                    "Year: " + d.properties.year.substring(0, 4) + "<br />")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });
}