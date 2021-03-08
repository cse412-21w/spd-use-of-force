//import data
import by_race from '../static/by_race.csv'

//set up height, width, margin
var container;
var race;
var uof_percent;
var height = 700;
var width = 950;
var margin = ({top: 10, right: 10, bottom: 35, left: 35});
var dataArray = [];

var y = d3.scaleLinear() 
    .domain([-1, 1])
    .range([height, margin.top]);

d3.csv(by_race).then(function(data) {
  data.forEach(function(d){
    dataArray.push(d);
  })

  makeViz();
});

function makeViz() {

  let dropDown = document.querySelector("#dropDown");

  dropDown.addEventListener('change', (event) => {
    let dataType = event.target.value;
    
    update(dataArray.map(d => d[dataType]));
  })


  // scale functions
  var x = d3.scaleBand()
    .domain(dataArray.map(d => d.race))
    .range([margin.left, width - margin.right]);

  // var y = d3.scaleLinear() 
  //   .domain([-1, 1])
  //   .range([height, margin.top]);


  container = d3.select('#staticBar')
      .append('svg')
        .attr("id", "basic-chart")
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
      // .attr('y', d => (y(d.difference)))
      .attr('width', x.bandwidth())
      // .attr('height', d => height / 2 - y(d.difference) + margin.top / 2)
      .attr("y", (d) => {
        if(d.difference > 0) {
          return y(d.difference)
        } else {
          return y(-1)/2
        }})
      .attr('height', d => 
            d3.max([height / 2 - y(d.difference), 
            -(height / 2 - y(d.difference))]))
      
      .style('fill', 'steelblue')
      .style('stroke', 'white');

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
      .attr('y', height / 2)
      .text('total UOF Percents');     

// position and populate the y-axis
  var yAxis = container.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

}

function update(data) {

  var u = container.selectAll("rect")
    .data(data);
    
  u
    .enter()
    .append("rect")
    .merge(u);
    console.log(data);
    console.log(y(data));
  u
    .transition()
    .duration(1000)
      .attr("y", (d) => {
        if(data > 0) {
          return y(data);
        } else {
          return y(-1)/2;
        }})
      .attr('height', d => 
            d3.max([height / 2 - y(data), 
            -(height / 2 - y(data))]))


}