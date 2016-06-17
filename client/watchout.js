// start slingin' some d3 here.

// create 10 svg elements
  // imgs will be set to asteroid.png

var data = [];

var width = 500;
var height = 500;

for (var i = 0; i < 10; i++) {
  data.push({'id': i,
            'x': Math.random() * width,
            'y': Math.random() * height});
}

// svg === game board
var svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'red');

var update = function(data) {

  var images = svg.selectAll('image')
              .data(data, function(d) {
                return d.id;
              });

  images.enter()
            .append('image')
            .attr('x', function(d) {
              return d.x;
            })
            .attr('y', function(d) {
              return d.y;
            })
            .attr('height', 50)
            .attr('width', 50)
            .attr('xlink:href', 'asteroid.png');            

  images.attr('x', function(d) {
    return d.x;
  })
  .attr('y', function(d) {
    return d.y;
  });

};

update(data);

setInterval(function() {
  update(
    data.map(function(image) {
      image.x = Math.random() * width;
      image.y = Math.random() * height;
      return image;
    })
  );
}, 500);

