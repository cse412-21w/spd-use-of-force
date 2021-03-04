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
})({"vpAz":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/spd-use-of-force/by_race.e8d3ea54.csv";
},{}],"Rk44":[function(require,module,exports) {
"use strict";

var _by_race = _interopRequireDefault(require("../static/by_race.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import data
//set up height, width, margin
var container;
var race;
var uof_percent;
var height = 700;
var width = 950;
var margin = {
  top: 10,
  right: 10,
  bottom: 35,
  left: 35
};
var dataArray = [];
var uof_percet = [];
var pop_percent = [];
var difference = [];
d3.csv(_by_race.default).then(function (data) {
  data.forEach(function (d) {
    dataArray.push(d);
  });
  uof_percent = dataArray.map(function (d) {
    return d.uof_percent;
  });
  pop_percent = dataArray.map(function (d) {
    return d.pop_percent;
  });
  difference = dataArray.map(function (d) {
    return d.difference;
  });
  makeViz();
});

function makeViz() {
  // scale functions
  var x = d3.scaleBand().domain(dataArray.map(function (d) {
    return d.race;
  })).range([margin.left, width - margin.right]);
  var y = d3.scaleLinear().domain([-1, 1]).range([height - margin.bottom, margin.top]);
  container = d3.select('#staticBar').append('svg').attr("id", "basic-chart").attr('width', width).attr('height', height).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var bars = container.append('svg').selectAll('rect').data(dataArray).join('rect').attr('x', function (d) {
    return x(d.race);
  }).attr('y', function (d) {
    return y(d.uof_percent);
  }).attr('width', x.bandwidth()).attr('height', function (d) {
    return height / 2 - y(d.uof_percent);
  }).style('fill', 'steelblue').style('stroke', 'white'); // position and populate the x-axis

  var xAxis = container.append('g').attr('transform', "translate(0, ".concat(height - margin.bottom, ")")).call(d3.axisBottom(x)).append('text').attr('text-anchor', 'end').attr('fill', 'white').attr('font-size', '12px').attr('font-weight', 'bold').attr('x', width - margin.right).attr('y', height / 2).text('total UOF Percents'); // position and populate the y-axis

  var yAxis = container.append('g').attr('transform', "translate(".concat(margin.left, ", 0)")).call(d3.axisLeft(y)); // var updateBars = function(data) {
  // }
}

function update(data) {
  var y = d3.scaleLinear().domain([-1, 1]).range([height - margin.bottom, margin.top]);
  var u = container.selectAll("rect").data(data);
  u.enter().append("rect").merge(u).transition().duration(1000).attr("y", y(data)).attr("height", height / 2 - y(data));
}
},{"../static/by_race.csv":"vpAz"}]},{},["Rk44"], null)
//# sourceMappingURL=https://cse412-21w.github.io/spd-use-of-force/NicoleViz.2385cfa3.js.map