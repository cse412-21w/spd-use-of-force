//import data
import by_race from '../static/by_race.csv'

//set up height, width, margin
var container;
var height = 700;
var width = 950;
var margin = ({top: 10, right: 10, bottom: 35, left: 35});
var dataArray = [];

d3.csv(by_race).then(function(data) {
    data.forEach(function(d){
      dataArray.push(d);
    })
    makeStaticViz();
  });

console.log(dataArray);

console.log(dataArray.map(a => a.uof_percent));

//scale functions
var x = d3.scaleBand()
    .domain(dataArray.map(d => d.race))
    .range([margin.left, width - margin.right]);
var y = d3.scaleLinear() 
    .domain([-1, 1])
    .range([height - margin.bottom, margin.top]);



function makeStaticViz() {
    container = d3.select('#staticBar')
        .append('svg')
        .attr("id", "basic-chart")
        .attr('width', width)
        .attr('height', height);
    
    var bars = container
        .append('svg')
        .selectAll('rect')
        .data(dataArray)
        .join('rect')
        .attr('x', d => x(d.race))  
        .attr('y', d => (y(d.uof_percent)))
        .attr('width', x.bandwidth())
        .attr('height', d => height / 2 - y(d.uof_percent))
        .style('fill', 'steelblue')
        .style('stroke', 'white')
    ;

  // position and populate the x-axis
    var xAxis = container.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .append('text')
        .attr('text-anchor', 'end')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('x', width - margin.right)
        .attr('y', -10)
        .text('total UOF Percents');     

  // position and populate the y-axis
    var yAxis = container.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));
}