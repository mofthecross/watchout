
// d3.select('body').selectAll('div').data(json).enter()
//   .append('div');


// filter year 2013
// only interested in getting a data that {"ALZ": 489}
var filterByYear = json.data.filter(function(entry) {
  return entry[8] === '2013' && 
         entry[9].slice(0, 3) === '946';
});

//console.log(filterByYear);

var data = [];

var addToData = function(causeOfDeath) {
  var found = false;
  for (var i = 0; i < data.length; i++) {
    if (data[i].cod === causeOfDeath) {
      found = true;
      data[i].count += 1;
    }
  }
  if (!found) {
    data.push({cod: causeOfDeath, count: 1});
  }
};

filterByYear.forEach(function(entry) {
  var causeOfDeath = entry[10]; //string
  addToData(causeOfDeath);
});


//create SVG element
var w = 500;
var h = 100;

var svg = d3.select('body')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

svg.selectAll('react')
    .data(filterByYear)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 20)
    .attr('height', 100);

