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
module.exports = "https://cse412-21w.github.io/spd-use-of-force/by_race.104bfcfe.csv";
},{}],"Rk44":[function(require,module,exports) {
"use strict";

var _by_race = _interopRequireDefault(require("../static/by_race.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import data
//set up height, width, margin
var container;
var height = 500;
var width = 700;
var margin = {
  top: 10,
  right: 10,
  bottom: 35,
  left: 20
};
var dataArray = [];
var color;
var y = d3.scaleLinear().domain([-100, 100]).range([height, margin.top]);
d3.csv(_by_race.default).then(function (data) {
  data.forEach(function (d) {
    dataArray.push(d);
  });
  console.log(dataArray);
  makeViz();
});

function makeViz() {
  var color = d3.scaleOrdinal(d3.schemeTableau10).domain(dataArray.map(function (d) {
    return d.race;
  }));
  var dropDown = document.querySelector("#dropDown");
  dropDown.addEventListener('change', function (event) {
    var dataType = event.target.value;
    update(dataArray.map(function (d) {
      return d[dataType];
    }));
  }); // scale functions

  var x = d3.scaleBand().domain(dataArray.map(function (d) {
    return d.race;
  })).range([margin.left, width - margin.right]);
  container = d3.select('#staticBar').append('svg').attr("id", "basic-chart").attr('width', width).attr('height', height).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var bars = container.append('svg').selectAll('rect').data(dataArray).join('rect').attr('x', function (d) {
    return x(d.race);
  }).attr('y', function (d) {
    return y(d.pop_percent);
  }).attr('width', x.bandwidth()).attr('height', function (d) {
    return height / 2 - y(d.pop_percent) + margin.top;
  }).style('fill', function (d) {
    return color(d.race);
  }).style('stroke', 'white'); // position and populate the x-axis

  var xAxis = container.append('g').attr('transform', "translate(0, ".concat(height - margin.bottom, ")")).call(d3.axisBottom(x)).append('text').attr('text-anchor', 'end').attr('fill', 'white').attr('font-size', '12px').attr('font-weight', 'bold').attr('x', width - margin.right).attr('y', height / 2).text('total UOF Percents'); // position and populate the y-axis

  var yAxis = container.append('g').attr('transform', "translate(".concat(margin.left, ", 0)")).call(d3.axisLeft(y));
}

function update(data) {
  var u = container.selectAll("rect").data(data);
  u.enter().append("rect").merge(u).transition().duration(1000).attr("y", function (d) {
    if (d > 0) {
      return y(d);
    } else {
      return y(-1) / 2;
    }
  }).attr('height', function (d) {
    return d3.max([height / 2 - y(d), -(height / 2 - y(d))]);
  });
}
},{"../static/by_race.csv":"vpAz"}]},{},["Rk44"], null)
//# sourceMappingURL=https://cse412-21w.github.io/spd-use-of-force/NicoleViz.c2da8f17.js.map