// start slingin' some d3 here.

// create 10 svg elements
  // imgs will be set to asteroid.png

var data = [];

var width = 500;
var height = 500;

for (var i = 0; i < 10; i++) {
  data.push({'id': i,
            'cx': Math.random() * width,
            'cy': Math.random() * height});
}

// svg === game board
var svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'red');

var update = function(data) {

  var circles = svg.selectAll('circle')
              .data(data, function(d) {
                return d.id;
              });

  circles.enter()
            .append('circle')
            .attr('cx', function(d) {
              return d.cx;
            })
            .attr('cy', function(d) {
              return d.cy;
            })
            .attr('r', 25)
            .attr('fill', 'blue');

  circles.attr('cx', function(d) {
    return d.cx;
  })
  .attr('cy', function(d) {
    return d.cy;
  });

};

update(data);

setInterval(function() {
  update(
    data.map(function(circle) {
      circle.cx = Math.random() * width;
      circle.cy = Math.random() * height;
      return circle;
    })
  );
}, 500);

