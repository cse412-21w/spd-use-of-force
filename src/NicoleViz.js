//import data
import by_race from '../static/by_race.csv'

//set up height, width, margin
var container;
var height = 500;
var width = 700;
var margin = ({top: 10, right: 10, bottom: 35, left: 20});
var dataArray = [];
var color;

var y = d3.scaleLinear() 
    .domain([-80, 80])
    .range([height - margin.bottom, margin.top]);

d3.csv(by_race).then(function(data) {
  data.forEach(function(d){
    dataArray.push(d);
  })
  console.log(dataArray)
  makeViz();
});

function makeViz() {

  var color = d3.scaleOrdinal(d3.schemeTableau10).domain(dataArray.map(d => d.race)); 

  let dropDown = document.querySelector("#dropDown");

  dropDown.addEventListener('change', (event) => {
    let dataType = event.target.value;
    
    update(dataArray.map(d => d[dataType]));
  })


  // scale functions
  var x = d3.scaleBand()
    .domain(dataArray.map(d => d.race))
    .range([margin.left, width - margin.right])
    .paddingOuter(.15)
    .paddingInner(.05);


  container = d3.select('#staticBar')
      .append('svg')
        .attr('width', width)
        .attr('height', height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var bars = container
      .append('svg')
      .selectAll('rect')
      .data(dataArray)
      .join('rect')
      .attr('x', d => x(d.race))  
      .attr('y', d => (y(d.pop_percent)))
      .attr('width', x.bandwidth())
      .attr('height', d => height / 2 - margin.top - y(d.pop_percent) - 2.5)

      .style('fill', d => color(d.race))
      .style("opacity", .85)
      .style('stroke', 'grey')
      .style('stroke-width', 2);

  // position and populate the x-axis
  var xAxis = container.append('g')
      .attr('transform', `translate(0, ${height / 2 - margin.top - 2.5})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('text-anchor', 'end')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');
      
  

// position and populate the y-axis
  var yAxis = container.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

}

function update(data) {

  var u = container.selectAll("rect")
    .data(data);
    
  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
      .attr("y", (d) => {
        if(d > 0) {
          return y(d)
        } else {
          return y(-80)/2 + (margin.top / 2)
        }})
      .attr('height', d => 
            d3.max([height / 2 - margin.top - y(d) - 2.5, 
            -(height / 2 - margin.top - y(d) - 2.5)]));

  
}