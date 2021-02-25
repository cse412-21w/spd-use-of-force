//import data
import by_race from '../static/by_race.csv'

//set up height, width, margin
var height = 700;
var width = 950;
var margin = ({top: 10, right: 10, bottom: 20, left: 35});

//scale functions
var x = d3.scaleBand()
    .domain(by_race.map(d => d.race))
    .range([margin.left, width - margin.right]);
var y = d3.scaleLinear() 
    .domain([-1, 1])
    .range([height - margin.bottom, margin.top]);


makeStaticViz();
function makeStaticViz() {
    const container = d3.select('#staticBar')
        .append('svg')
        .att("id", "basic-chart")
        .attr('width', width)
        .attr('height', height);
    
    const bars = container.selectAll('rect')
        .data(uof_for_me)
        .join('rect')
        .attr('x', d => x_new(d.race))  
        .attr('y', d => (y_new_per(d.uof_percent)))
        .attr('width', x_new.bandwidth())
        .attr('height', d => height / 2 - y_new_per(d.uof_percent))
        .style('fill', 'steelblue')
        .style('stroke', 'white')
    ;

  // position and populate the x-axis
    const xAxis = container.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x_new))
        .append('text')
        .attr('text-anchor', 'end')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('x', width - margin.right)
        .attr('y', -10)
        .text('total UOF Percents');     

  // position and populate the y-axis
    const yAxis = container.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y_new_per));
}