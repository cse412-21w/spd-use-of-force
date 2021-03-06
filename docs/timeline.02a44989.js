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
})({"timeline.js":[function(require,module,exports) {
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
var racee = ["White", "Black or African American", "Not Specified", "Hispanic or Latino", "Asian", "American Indian/Alaska Native", "Nat Hawaiian/Oth Pac Islander"];
var race = ["American Indian/Alaska Native", "Asian", "Black or African American", "Hispanic or Latino", "Nat Hawaiian/Oth Pac Islander", "Not Specified", "White"];
d3.json("https://data.seattle.gov/resource/ppi5-g2bj.json?$limit=20000").then(function (data) {
  var levels = ["Level 1 - Use of Force", "Level 2 - Use of Force", "Level 3 - Use of Force", "Level 3 - OIS"];
  var parser = d3.timeParse('%Y-%m-%dT%H:%M:%S.%L');
  var year = d3.timeFormat('%B %Y');
  var bb = d3.timeFormat('%Y-%m');
  var mm = d3.timeFormat('%Y-%m-%d');
  uof = data.map(function (incident) {
    return _objectSpread(_objectSpread({}, incident), {}, {
      incident_type: 1 + levels.indexOf(incident.incident_type),
      occured_date_time: parser(incident.occured_date_time),
      Occurance_Date: year(parser(incident.occured_date_time)),
      blah: bb(parser(incident.occured_date_time)),
      byMonth_Date: bb(parser(incident.occured_date_time)),
      total: incident.subject_race,
      Date: mm(parser(incident.occured_date_time))
    });
  }); // console.log(uof); // This line was used to check values stored in uof after processing. feel free to delete.

  drawTimeline();
  drawDaily(); // your other functions goes here. 
});

function drawTimeline() {
  var selection = vl.selectSingle('Select').fields('subject_race').init({
    subject_race: racee[0]
  }).bind(vl.menu(racee));
  var single_Line = vl.markLine({
    point: false
  }).data(uof).select(selection).encode(vl.x().fieldT('byMonth_Date').title("Month, Year").timeUnit("yearmonth"), vl.y().count("subject_race").title("Counts"), vl.color().field("subject_race"), vl.opacity().if(selection, vl.value(1.0)).value(0.10), vl.tooltip([{
    "aggregate": "count",
    "field": "subject_race"
  }, "subject_race", "Occurance_Date"])); // layer you made for highlighting the line when selecting a state in the menu, store it in const b

  var b = vl.data(uof).layer(single_Line).title("Monthly Counts, by Race").width(700).height(400);
  var hover2 = vl.selectSingle().encodings('x').on('mouseover').nearest(true).empty('none');
  var line_ = vl.markLine().data(uof).transform(vl.filter(selection)) // new 
  .encode(vl.opacity().value(1), vl.x().fieldT('byMonth_Date').title("Month, Year").timeUnit("yearmonth"), vl.y().count("subject_race").title("Counts"));
  var line = vl.markLine().data(uof).transform(vl.filter(selection)) // new
  .select(vl.selectInterval().bind('scales').encodings('x') // Just adding a line of code, how amazing!
  ).encode(vl.opacity().value(0), vl.x().fieldT('byMonth_Date').title("Month, Year").timeUnit("yearmonth"), vl.y().count("subject_race").title("Counts"), vl.color().fieldN("subject_race"));
  var base = line_.transform(vl.filter(hover2), vl.filter(selection)); // New: 2 filter in transform()

  var label = {
    align: 'center',
    dx: 7,
    dy: -10
  };
  var white = {
    stroke: 'white',
    strokeWidth: 2
  };
  var dateLabel = {
    align: 'center',
    dx: 5,
    dy: -5
  };
  var white1 = {
    stroke: 'white',
    strokeWidth: 2
  };
  var tooltipBase = base.transform(vl.filter(hover2));
  var tooltip = vl.layer(tooltipBase.markText({
    align: "center"
  }).select(vl.selectInterval().bind()).encode(vl.y().value(15), vl.text().fieldT("byMonth_Date").timeUnit("yearmonth"), vl.color().value("black")));
  var a = vl.data(uof) // store your hover part in const a
  .layer(vl.markRule({
    color: '#aaa'
  }).transform(vl.filter(hover2)).encode(vl.x().fieldT('byMonth_Date').timeUnit("yearmonth")), //line_.markCircle({color: "gray"})
  line_.markCircle().select(hover2).encode(vl.opacity().if(hover2, vl.value(1)).value(0), vl.color().fieldN("subject_race")), base.markText(label, white).encode(vl.text().count('subject_race')), base.markText(label).encode(vl.text().count('subject_race')), tooltip).title("Total Monthly Counts").width(600).height(400); // combine 2 layer

  return vl.layer(b, a, line).render().then(function (viewElement) {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view1').appendChild(viewElement);
  });
}

function drawDaily() {
  var selection = vl.selectSingle('Select').fields('subject_race').init({
    subject_race: racee[0]
  }).bind(vl.menu(racee));
  var single_Line = vl.markLine({
    point: false
  }).data(uof).select(selection).encode(vl.x().fieldT('Date').title("Month, Day, Year").timeUnit("yearmonthdate"), vl.y().count("subject_race").title("Counts"), vl.color().field("subject_race"), vl.opacity().if(selection, vl.value(1.0)).value(0.10), vl.tooltip([{
    "aggregate": "count",
    "field": "subject_race"
  }, "subject_race", "Occurance_Date"])); // layer you made for highlighting the line when selecting a state in the menu, store it in const b

  var b = vl.data(uof).layer(single_Line).title("Daily Counts, by Race").width(700).height(400);
  var hover2 = vl.selectSingle().encodings('x').on('mouseover').nearest(true).empty('none');
  var line_ = vl.markLine().data(uof).transform(vl.filter(selection)) // new 
  .encode(vl.opacity().value(1), vl.x().fieldT('Date').title("Month, Day, Year").timeUnit("yearmonthdate"), vl.y().count("subject_race").title("Counts"));
  var line = vl.markLine().data(uof).transform(vl.filter(selection)) // new
  .select(vl.selectInterval().bind('scales').encodings('x') // Just adding a line of code, how amazing!
  ).encode(vl.opacity().value(0), vl.x().fieldT('Date').title("Month, Day, Year").timeUnit("yearmonthdate"), vl.y().count("subject_race").title("Counts"), vl.color().fieldN("subject_race"));
  var base = line_.transform(vl.filter(hover2), vl.filter(selection)); // New: 2 filter in transform()

  var label = {
    align: 'center',
    dx: 7,
    dy: -10
  };
  var white = {
    stroke: 'white',
    strokeWidth: 2
  };
  var dateLabel = {
    align: 'center',
    dx: 5,
    dy: -5
  };
  var white1 = {
    stroke: 'white',
    strokeWidth: 2
  };
  var tooltipBase = base.transform(vl.filter(hover2));
  var tooltip = vl.layer(tooltipBase.markText({
    align: "center"
  }).select(vl.selectInterval().bind()).encode(vl.y().value(15), vl.text().fieldT("Date").timeUnit("yearmonthdate"), vl.color().value("black")));
  var a = vl.data(uof) // store your hover part in const a
  .layer(vl.markRule({
    color: '#aaa'
  }).transform(vl.filter(hover2)).encode(vl.x().fieldT('Date').timeUnit("yearmonthdate")), //line_.markCircle({color: "gray"})
  line_.markCircle().select(hover2).encode(vl.opacity().if(hover2, vl.value(1)).value(0), vl.color().fieldN("subject_race")), base.markText(label, white).encode(vl.text().count('subject_race')), base.markText(label).encode(vl.text().count('subject_race')), tooltip).title("Daily Counts, by Race").width(600).height(400); // combine 2 layer

  return vl.layer(b, a, line).render().then(function (viewElement) {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view2').appendChild(viewElement);
  });
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57753" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","timeline.js"], null)
//# sourceMappingURL=/timeline.02a44989.js.map