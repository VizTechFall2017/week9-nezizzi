var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 50;
var marginTop = 50;

var nestedData = [];
var formerDancers;
var currentDancers;
var testMap = d3.map();
clicked=false;

//circle variables
var circles;
var circle_axis;
var circles2;
var circle_axis2;
var center_x=150;
var center_y=175;
var R=20;
var center_x2=150;
var center_y2=175;

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

svg.append('text')
    .attr('x', 350)
    .attr('y', 350)
    .attr('class', 'textBox')
    .text('');

var axislabel = [{value: 1, text: "None"},
    {value: 2, text: "Diploma from Dance School"},
    {value: 3, text: "Diploma from Performing Arts School"},
    {value: 4, text: "Bachelor's Degree"},
    {value: 5, text: " Advanced Diploma from Dance School"},
    {value: 6, text: "Advanced Diploma from Performing Arts School"},
    {value: 7, text: "Graduate Degree"},
    {value: 8, text: "Other"},
    {value: "D", text: "Did not answer"}
];


var LABEL= axislabel.forEach(function (d) {
    testMap.set(d.value, d.text);
});


var axislabel2 = [{value: 1, text: "Completed Primary School"},
    {value: 2, text: "Completed Secondary School"},
    {value: 3, text: "Post-Secondary Diploma, certificate"},
    {value: 4, text: "Bachelor's Degree"},
    {value: 5, text: "Graduate Degree"},
    {value: 6, text: "Other"},
    {value: "D", text: "Did not answer"}
];


var LABEL2= axislabel2.forEach(function (d) {
    testMap.set(d.value, d.text);
});

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//console.log(testMap);
//console.log(testMap.get(5));

//axis key1
axisKey=svg.selectAll('line')
    .data(axislabel)
    .enter()
    .append('line');

axisKeyLabel= axisKey
    .append('line')
    .attr("x1", '50')
    .attr("y1", function(d){
        if (isNaN(d.value)) {
            return 0
        } else {
            console.log(d.value);
            return 100+10*d.value
        }
    })
    .attr("x2", '50')
    .attr("y2", function(d){
        if (isNaN(d.value)) {
            return 0
        } else {
            return 100+10*d.value
        }
    })
    .attr("stroke", "black")
    .attr('stoke-width', '10')
    .attr('stroke-dasharray', function (d) {
            return d.value
        });



//import the data from the .csv file
d3.csv('./data.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function (d) {
            return d.A1CURFOR
        })
        .entries(dataIn);
    currentDancers = nestedData.filter(function(d){return d.key == '1'})[0].values;
    formerDancers = nestedData.filter(function(d){return d.key == '2'})[0].values;

   svg.append('text')
       .text('Highest Level Dance Education')
       .attr('transform','translate(20, 0)');
   svg2.append('text')
       .text('Highest Level Non-Dance Education')
       .attr('transform','translate(10, 0)');


    svg.selectAll('line')
        .data(currentDancers, function(d){return d.A6QUALS1;})
        .enter()
        .append('line');

    //circle axes
    circles=svg.selectAll('circle')
        .data(axislabel)
        .enter()
        .append('circle');

    circle_axis= circles
        .attr("cx", center_x)
        .attr("cy", center_y)
        .attr("r", function(d){
            //console.log(d.value);
            if (isNaN(d.value)) {
                return 0
            } else {
                return R*d.value
            }
        })
        .attr("stroke", "black")
        .attr('stroke-dasharray', function (d) {
            return d.value
        })
        .attr('stoke-width', '10')
        .attr("fill", "none")
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d){
            return  d.text;
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(10)
                .style("opacity", .9);
            div.html(d.text)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(1000)
                .style("opacity", 0);
        });



    svg2.selectAll('line')
        .data(currentDancers, function(d){return d.A7GENED;})
        .enter()
        .append('line');

    circles2=svg2.selectAll('circle')
        .data(axislabel2)
        .enter()
        .append('circle');

    circle_axis2= circles2
        .attr("cx", center_x2)
        .attr("cy", center_y2)
        .attr("r", function(d){
            //console.log(d.value);
            if (isNaN(d.value)) {
                return 0
            } else {
                return R*d.value
            }
        })
        .attr("stroke", "slategrey")
        .attr('stroke-dasharray', function (d) {
            return d.value
        })
        .attr("fill", "none")
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d){
            return  d.text;
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(10)
                .style("opacity", .9);
            div.html(d.text)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(1000)
                .style("opacity", 0);
        });


    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(currentDancers);

});



function drawPoints(pointData){

   var lines = svg.selectAll('line')
       .data(pointData, function(d){
           //console.log(d.A6QUALS1);
           return d.A6QUALS1;
       });

    //look to see if there are any old bars that don't have keys in the new data list, and remove them.
    lines.exit()
        .remove();

    //update the properties of the remaining bars (as before)
    lines
        .append('line')
        .attr('x1',center_x)
        .attr('y1',center_y)
        .attr('x2', function(d){
            if (isNaN(d.A6QUALS1)) {
                return center_x
            } else {
                return center_x - R*d.A6QUALS1*(Math.cos((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
        })
        .attr('y2', function(d){
            if (isNaN(d.A6QUALS1)) {
                return center_y
            } else {
                return  center_y - R*d.A6QUALS1*(Math.sin((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
        })
        .attr('stroke','red');

    //add the enter() function to make bars for any new countries in the list, and set their properties
    lines
        .enter()
        .append('line')
        .attr('x1',center_x)
        .attr('y1',center_y)
        .attr('x2', function(d){
            if (isNaN(d.A6QUALS1)) {
                return center_x
            } else {
                return center_x - R*d.A6QUALS1*(Math.cos((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
           })
        .attr('y2', function(d){
            if (isNaN(d.A6QUALS1)) {
                return center_y
            } else {
                return  center_y - R*d.A6QUALS1*(Math.sin((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
        })
        .attr('id', function(d){
            return 'id' + d.CASEID
        })
        .attr('stroke','red')
        .on('mouseover', function(d){
            //console.log(d.A6QUALS1);
            //console.log(d.A7GENED);
            d3.select(this).attr('stroke-width', '10').attr('stroke','purple');
            var currentId =  d3.select(this).attr('id');
            svg2.selectAll('#' + currentId).attr('stroke-width', '10').attr('stroke', 'red');
        })
        .on('mouseout', function(d){
            d3.select(this).attr('stroke','red').attr('stroke-width', '1');
            var currentId =  d3.select(this).attr('id');
            svg2.selectAll('#' + currentId).attr('stroke', 'purple').attr('stroke-width', '1');
        });

    var lines2 = svg2.selectAll('line')
        .data(pointData, function(d){
            return d.A7GENED;
        });

    //look to see if there are any old bars that don't have keys in the new data list, and remove them.
    lines2.exit()
        .remove();

    //update the properties of the remaining bars (as before)
    lines2
        .append('line')
        .attr('x1',center_x2)
        .attr('y1',center_y2)
        .attr('x2', function(d){
            if (isNaN(d.A7GENED)) {
                return center_x2
            } else {
                return center_x2 - R*d.A7GENED*(Math.cos((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
        })
        .attr('y2', function(d){
            if (isNaN(d.A7GENED)) {
                return center_y2
            } else {
                return  center_y2 - R*d.A7GENED*(Math.sin((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
        })
        .attr('stroke','purple');

    //add the enter() function to make bars for any new countries in the list, and set their properties
    lines2
        .enter()
        .append('line')
        .attr('x1',center_x2)
        .attr('y1',center_y2)
        .attr('x2', function(d){
            if (isNaN(d.A7GENED)) {
                return center_x2
            } else {
                return center_x2 - R*d.A7GENED*(Math.cos((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
        })
        .attr('y2', function(d){
            if (isNaN(d.A7GENED)) {
                return  center_y2
            } else {
                return  center_y2 - R*d.A7GENED*(Math.sin((Math.floor(Math.random()*360))*(Math.PI/180)))
            }
        })
        .attr('id', function(d){
            return 'id' + d.CASEID
        })
        .attr('stroke','purple')
        .on("mouseover", function(d) {

        });
}

function buttonClicked(){

    if(clicked == true){
        drawPoints(currentDancers);
        clicked = false;
        d3.select('.textBox')
            .text('Current Dancers')

    }
    else{
        drawPoints(formerDancers);
        clicked = true;
        d3.select('.textBox')
            .text('Former Dancers')
    }
}
