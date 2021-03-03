//import data
import by_percent from '../static/by_percent.csv'

//set up height, width, margin
var container;
var height = 700;
var width = 950;
var margin = ({top: 10, right: 10, bottom: 35, left: 35});
var percentArray = [];

//putting data from csv into object array
d3.csv(by_percent).then(function(data) {
    data.forEach(function(d){
      percentArray.push(d);
      makeViz();
    })
});

console.log(percentArray)

function makeViz() {
//Scale function
var x = d3.scaleBand()
    .domain()

container = d3.select('#animatedBar')
    .append(svg)
        .attr('width', width)
        .attr('height', height);
}