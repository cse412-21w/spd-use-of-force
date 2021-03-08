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

var race = ["American Indian/Alaska Native", "Asian", "Black or African American", "Hispanic or Latino", "Nat Hawaiian/Oth Pac Islander", "Not Specified", "White"];

d3.json("https://data.seattle.gov/resource/ppi5-g2bj.json?$limit=20000").then(function(data) {
  const levels = ["Level 1 - Use of Force", "Level 2 - Use of Force", "Level 3 - Use of Force","Level 3 - OIS"];
    const parser = d3.timeParse('%Y-%m-%dT%H:%M:%S.%L');
    const year = d3.timeFormat('%B %Y');
    const bb = d3.timeFormat('%Y-%m');
    const mm = d3.timeFormat('%Y-%m-%d')
    uof = data.map(incident => ({
        ...incident,
        incident_type: 1+levels.indexOf(incident.incident_type),
        occured_date_time: parser(incident.occured_date_time),
        Occurance_Date: year(parser(incident.occured_date_time)),
        blah: bb(parser(incident.occured_date_time)),
        byMonth_Date: bb(parser(incident.occured_date_time)),
        total: incident.subject_race,
        Date: mm(parser(incident.occured_date_time))

    }));
   // console.log(uof); // This line was used to check values stored in uof after processing. feel free to delete.
    drawTimeline();
    drawDaily();
    // your other functions goes here. 
});
 
  function drawTimeline() {
   const selection = vl.selectSingle('Select')
    .fields('subject_race')
    .init({subject_race: race[5]})
    .bind(vl.menu(race));
  
  const single_Line = vl.markLine({point: false})  
    .data(uof)
    .select(selection)
    .encode(
      vl.x().fieldT('byMonth_Date').title("Month, Year").timeUnit("yearmonth"),
      vl.y().count("subject_race").title("Counts"), 
      vl.color().field("subject_race"),
      vl.opacity().if(selection, vl.value(1.0)).value(0.10),
      vl.tooltip([{"aggregate": "count", "field": "subject_race"}, "subject_race", "Occurance_Date"])
  );
  // layer you made for highlighting the line when selecting a state in the menu, store it in const b
  const b = vl.data(uof)
    .layer(
      single_Line
    )
    .title("Monthly Counts, by Race")
    .width(700)
    .height(400);

  
   const hover2 = vl.selectSingle()
    .encodings('x')
    .on('mouseover')
    .nearest(true)
    .empty('none');
  
   const line_ = vl.markLine()
    .data(uof)
    .transform(vl.filter(selection))    // new 
    .encode(
      vl.opacity().value(1),
      vl.x().fieldT('byMonth_Date').title("Month, Year").timeUnit("yearmonth"),
      vl.y().count("subject_race").title("Counts"),
    );
  
    const line = vl.markLine()
      .data(uof)
      .transform(vl.filter(selection))  // new
     .select(
      vl.selectInterval().bind('scales').encodings('x'),    // Just adding a line of code, how amazing!
       )
      .encode(
        vl.opacity().value(0),
        vl.x().fieldT('byMonth_Date').title("Month, Year").timeUnit("yearmonth"),
        vl.y().count("subject_race").title("Counts"),
        vl.color().fieldN("subject_race")
      );
      const base = line_.transform(vl.filter(hover2), vl.filter(selection));    // New: 2 filter in transform()
      const label = {align: 'center', dx: 7, dy: -10};
      const white = {stroke: 'white', strokeWidth: 2};
      const dateLabel = {align: 'center', dx:5, dy: -5};
      const white1 = {stroke: 'white', strokeWidth: 2};
      const tooltipBase = base
        .transform(vl.filter(hover2));
      const tooltip = vl.layer(
      tooltipBase.markText({ align: "center"})
        .select(
          vl.selectInterval().bind()
        )
        .encode(
          vl.y().value(15),
          vl.text().fieldT("byMonth_Date").timeUnit("yearmonth"),
          vl.color().value("black")
        )
      );
    
      const a = vl.data(uof)           // store your hover part in const a
        .layer(
          vl.markRule({color: '#aaa'})
            .transform(vl.filter(hover2))
            .encode(vl.x().fieldT('byMonth_Date').timeUnit("yearmonth")),
          //line_.markCircle({color: "gray"})
          line_.markCircle()
          .select(hover2)
            .encode(vl.opacity().if(hover2, vl.value(1)).value(0), vl.color().fieldN("subject_race")),
          base.markText(label, white).encode(vl.text().count('subject_race')),
          base.markText(label).encode(vl.text().count('subject_race')),
          tooltip
        )
      .title("Total Monthly Counts")
      .width(600)
      .height(400);
    
  // combine 2 layer
  return vl.layer(b, a, line).render()
    .then(viewElement => {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view1').appendChild(viewElement);
  });
}

function drawDaily() {
  const selection = vl.selectSingle('Select')
    .fields('subject_race')
    .init({subject_race: race[5]})
    .bind(vl.menu(race));
  
  const single_Line = vl.markLine({point: false})  
    .data(uof)
    .select(selection)
    .encode(
      vl.x().fieldT('Date').title("Month, Day, Year").timeUnit("yearmonthdate"),
      vl.y().count("subject_race").title("Counts"), 
      vl.color().field("subject_race"),
      vl.opacity().if(selection, vl.value(1.0)).value(0.10),
      vl.tooltip([{"aggregate": "count", "field": "subject_race"}, "subject_race", "Occurance_Date"])
  );
  // layer you made for highlighting the line when selecting a state in the menu, store it in const b
  const b = vl.data(uof)
    .layer(
      single_Line
    )
    .title("Daily Counts, by Race")
    .width(700)
    .height(400);

  
   const hover2 = vl.selectSingle()
    .encodings('x')
    .on('mouseover')
    .nearest(true)
    .empty('none');
  
   const line_ = vl.markLine()
    .data(uof)
    .transform(vl.filter(selection))    // new 
    .encode(
      vl.opacity().value(1),
      vl.x().fieldT('Date').title("Month, Day, Year").timeUnit("yearmonthdate"),
      vl.y().count("subject_race").title("Counts"),
    );
  
    const line = vl.markLine()
      .data(uof)
      .transform(vl.filter(selection))  // new
     .select(
      vl.selectInterval().bind('scales').encodings('x'),    // Just adding a line of code, how amazing!
       )
      .encode(
        vl.opacity().value(0),
        vl.x().fieldT('Date').title("Month, Day, Year").timeUnit("yearmonthdate"),
        vl.y().count("subject_race").title("Counts"),
        vl.color().fieldN("subject_race")
      );
      const base = line_.transform(vl.filter(hover2), vl.filter(selection));    // New: 2 filter in transform()
      const label = {align: 'center', dx: 7, dy: -10};
      const white = {stroke: 'white', strokeWidth: 2};
      const dateLabel = {align: 'center', dx:5, dy: -5};
      const white1 = {stroke: 'white', strokeWidth: 2};
      const tooltipBase = base
        .transform(vl.filter(hover2));
      const tooltip = vl.layer(
      tooltipBase.markText({ align: "center"})
        .select(
          vl.selectInterval().bind()
        )
        .encode(
          vl.y().value(15),
          vl.text().fieldT("Date").timeUnit("yearmonthdate"),
          vl.color().value("black")
        )
      );
    
      const a = vl.data(uof)           // store your hover part in const a
        .layer(
          vl.markRule({color: '#aaa'})
            .transform(vl.filter(hover2))
            .encode(vl.x().fieldT('Date').timeUnit("yearmonthdate")),
          //line_.markCircle({color: "gray"})
          line_.markCircle()
          .select(hover2)
            .encode(vl.opacity().if(hover2, vl.value(1)).value(0), vl.color().fieldN("subject_race")),
          base.markText(label, white).encode(vl.text().count('subject_race')),
          base.markText(label).encode(vl.text().count('subject_race')),
          tooltip
        )
      .title("Daily Counts, by Race")
      .width(600)
      .height(400);
    
  // combine 2 layer
  return vl.layer(b, a, line).render()
    .then(viewElement => {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view2').appendChild(viewElement);
  });
}

