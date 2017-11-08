var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up the projection for the map
var albersProjection = d3.geoAlbersUsa()  //tell it which projection to use
    .scale(700)                           //tell it how big the map should be
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels



var makeSymbol = d3.radialArea()
    .angle(function (d) {
        return d.angle
    })
    .innerRadius(function(d){
        return d.r0
    })
    .outerRadius(function(d){
        return d.r1
    });

var symbolPoints = [
    {angle: 0, r0: 30, r1: 80},
    {angle: Math.PI * 0.25, r0: 30, r1: 70},
    {angle: Math.PI * 0.5, r0: 30, r1: 80},
    {angle: Math.PI * 0.75, r0: 30, r1: 70},
    {angle: Math.PI, r0: 30, r1: 80},
    {angle: Math.PI * 1.25, r0: 30, r1: 70},
    {angle: Math.PI * 1.5, r0: 30, r1: 80},
    {angle: Math.PI * 1.75, r0: 30, r1: 70},
    {angle: Math.PI * 2, r0: 30, r1: 80}
];

var symbolData= makeSymbol(symbolPoints);

queue()
    .defer(d3.json, "./cb_2016_us_state_20m.json")
    .defer(d3.csv, "./dataPoints.csv")
    .await(function(err, mapData, dataPoints){

    svg.selectAll("path")               //make empty selection
        .data(mapData.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "feature")
        .attr('fill','gainsboro')
        .attr('stroke','white')
        .attr('stroke-width',.2);



    svg.selectAll('circle')
        .data(centroids)       //bind a single data point, with the long lat of Boston
                                                    //note that long is negative because it is a W long point!
        .enter()
        .append('g')
        .attr('transform', function(d){
            'translate('+albersProjection(d.long,d.lat)[0]+','+ albersProjection(d.long,d.lat)[1]+')'
    })
        .attr('cx', function (d){
            return d.albersProjection(d.long,d.lat)[0];
        })
        .attr('cy', function (d){
            return d.center[1];
        })
        .attr('id',function(d){return d.name})
        .attr('r', 10)
        .attr('fill','purple')
        .attr('fill-opacity',.7);


  });



