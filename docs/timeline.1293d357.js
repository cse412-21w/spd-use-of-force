// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"wV9k":[function(require,module,exports) {
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var options = {
  config: {// Vega-Lite default configuration
  },
  init: function init(view) {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas"
  }
};
vl.register(vega, vegaLite, options); // Again, We use d3.csv() to process data

var uof = [];
d3.json("https://data.seattle.gov/resource/ppi5-g2bj.json?$limit=20000").then(function (data) {
  var levels = ["Level 1 - Use of Force", "Level 2 - Use of Force", "Level 3 - Use of Force", "Level 3 - OIS"];
  var parser = d3.timeParse('%Y-%m-%dT%H:%M:%S.%L');
  var year = d3.timeFormat('%B %Y');
  var bb = d3.timeFormat('%Y-%m');
  uof = data.map(function (incident) {
    return _objectSpread(_objectSpread({}, incident), {}, {
      incident_type: 1 + levels.indexOf(incident.incident_type),
      occured_date_time: parser(incident.occured_date_time),
      Occurance_Date: year(parser(incident.occured_date_time)),
      blah: bb(parser(incident.occured_date_time))
    });
  }); // console.log(uof); // This line was used to check values stored in uof after processing. feel free to delete.

  drawTimeline(); // your other functions goes here. 
});

function drawTimeline() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
  var hover = vl.selectSingle().encodings('x') // limit selection to x-axis value
  .on('mouseover') // select on mouseover events
  .nearest(true) // select data point nearest the cursor
  .empty('none'); // empty selection includes no data points 

  var line = vl.markLine().data(uof).encode(vl.x().fieldT('blah').title("Date").timeUnit("yearmonth"), vl.y().count("subject_race").title("Counts"), vl.color().field("subject_race")); // shared base for new layers, filtered to hover selection

  var base = line.transform(vl.filter(hover)); // mark properties for text label layers

  var label = {
    align: 'left',
    dx: 5,
    dy: -5
  };
  var white = {
    stroke: 'white',
    strokeWidth: 2
  };
  var dateBase = base.transform(vl.filter(hover));
  var dateLabel = {
    align: 'center',
    dx: 5,
    dy: -5
  };
  var white1 = {
    stroke: 'white',
    strokeWidth: 2
  };
  var tooltipBase = base.transform(vl.filter(hover));
  var tooltip = vl.layer( // tooltipBase.markRule({ strokeWidth: 0.5 }),
  tooltipBase.markText({
    align: "center"
  }).encode(vl.y().value(0), vl.text().fieldT("blah").timeUnit("yearmonth"), vl.color().value("black")));
  vl.data(uof).layer(line, // add a rule mark to serve as a guide line
  vl.markRule({
    color: '#aaa'
  }).transform(vl.filter(hover)).encode(vl.x().fieldT('blah')), // add circle marks for selected time points, hide unselected points
  line.markCircle().select(hover) // use as anchor points for selection
  .encode(vl.opacity().if(hover, vl.value(1)).value(0)), // add white stroked text to provide a legible background for labels
  base.markText(label, white).encode(vl.text().count('subject_race')), // add text labels for stock prices
  base.markText(label).encode(vl.text().count('subject_race')), //    dateBase.markText(dateLabel, white1).encode(vl.text().count('subject_race')),
  //  dateBase.markText(dateLabel).encode(vl.text().fieldT('blah').timeUnit("yearmonthdate"))
  tooltip).width(700).height(350).title("Monthly Counts of Use of Force Incidents").render().then(function (viewElement) {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view').appendChild(viewElement);
  });
}
},{}]},{},["wV9k"], null)
//# sourceMappingURL=https://cse412-21w.github.io/spd-use-of-force/timeline.1293d357.js.map