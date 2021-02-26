const options = {
  config: {
    // Vega-Lite default configuration
  },
  init: (view) => {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas",
  },
};

vl.register(vega, vegaLite, options);

// Again, We use d3.csv() to process data
var uof = [];

d3.json("https://data.seattle.gov/resource/ppi5-g2bj.json?$limit=20000").then(function(data) {
  const levels = ["Level 1 - Use of Force", "Level 2 - Use of Force", "Level 3 - Use of Force","Level 3 - OIS"];
    const parser = d3.timeParse('%Y-%m-%dT%H:%M:%S.%L');
    const year = d3.timeFormat('%B %Y');
    const bb = d3.timeFormat('%Y-%m');
    uof = data.map(incident => ({
        ...incident,
        incident_type: 1+levels.indexOf(incident.incident_type),
        occured_date_time: parser(incident.occured_date_time),
        Occurance_Date: year(parser(incident.occured_date_time)),
        blah: bb(parser(incident.occured_date_time))
    }));
   // console.log(uof); // This line was used to check values stored in uof after processing. feel free to delete.
    drawTimeline();
    // your other functions goes here. 
});

function drawTimeline() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
  const hover = vl.selectSingle()
    .encodings('x')  // limit selection to x-axis value
    .on('mouseover') // select on mouseover events
    .nearest(true)   // select data point nearest the cursor
    .empty('none');  // empty selection includes no data points 
  const line = vl.markLine()
    .data(uof)
    .encode(
    vl.x().fieldT('blah').title("Date").timeUnit("yearmonth"),
    vl.y().count("subject_race").title("Counts"), 
    vl.color().field("subject_race"));
    // shared base for new layers, filtered to hover selection
   const base = line.transform(vl.filter(hover));

   // mark properties for text label layers
    const label = {align: 'left', dx: 5, dy: -5};
    const white = {stroke: 'white', strokeWidth: 2};
  
     const dateBase = base.transform(vl.filter(hover));
     const dateLabel = {align: 'center', dx:5, dy: -5};
     const white1 = {stroke: 'white', strokeWidth: 2};

     const tooltipBase = base
    .transform(vl.filter(hover));

    const tooltip = vl.layer(
   // tooltipBase.markRule({ strokeWidth: 0.5 }),
    tooltipBase.markText({ align: "center"}).encode(
      vl.y().value(0),
      vl.text().fieldT("blah").timeUnit("yearmonth"),
      vl.color().value("black")
    )
  )
  vl.data(uof)
    .layer(
      line,
      // add a rule mark to serve as a guide line
      vl.markRule({color: '#aaa'})
        .transform(vl.filter(hover))
        .encode(vl.x().fieldT('blah')),
      // add circle marks for selected time points, hide unselected points
      line.markCircle()
        .select(hover) // use as anchor points for selection
        .encode(vl.opacity().if(hover, vl.value(1)).value(0)),
      // add white stroked text to provide a legible background for labels
      base.markText(label, white).encode(vl.text().count('subject_race')),
      // add text labels for stock prices
      base.markText(label).encode(vl.text().count('subject_race')),
  //    dateBase.markText(dateLabel, white1).encode(vl.text().count('subject_race')),
    //  dateBase.markText(dateLabel).encode(vl.text().fieldT('blah').timeUnit("yearmonthdate"))
    tooltip)
    .width(700)
    .height(350)
    .title("Monthly Counts of Use of Force Incidents")
  
    .render()
    .then(viewElement => {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view').appendChild(viewElement);
  });
}
 

  