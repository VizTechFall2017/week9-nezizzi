var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 100;
var marginTop = 100;

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var parser= d3.timeParse('%m/%d/%Y');
 var scaleX=d3.scaleTime().range([0, width-2*marginLeft]);



svg.append('g')
    .attr('class' , 'x-axis')
    .attr('transform', 'translate( 0, '+(height-2*marginTop)+')')
        .call(d3.axisBottom(scaleX));


//import the data from the .csv file
d3.csv('./daca_timeline.csv', function(dataIn){
    dataIn.forEach(function(){
        d.date = parser (d.start_date)
    });

    scaleX.domain([d3.min(dataIn.map(function(d) {return d.date}))],[d3.max(dataIn.map(function(d) {return d.date}))]);

    d3.select('x-axis')
        .call(d3.axisBottom(scaleX).ticks(d3.timeYear.every(2)));

console.log(dataIn);

});
