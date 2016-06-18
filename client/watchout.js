// start slingin' some d3 here.

// create 10 svg elements
  // imgs will be set to asteroid.png

var data = [];

// width/height of board = 800
// width/height of asteroid = 50
// width/height of ship = 50
var width = 800 - 50;
var height = 800 - 50;

for (var i = 0; i < 10; i++) {
  data.push({'id': i,
            'x': Math.random() * width,
            'y': Math.random() * height});
}

// svg === game board
var svg = d3.select('div.board')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            //.attr('fill', 'black');
            .style('background-color', 'black');

var ship = svg
            .append('image')
            .attr('class', 'draggable')
            .attr('xlink:href', 'ship.png')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('height', 50)
            .attr('width', 50);

var update = function(data) {

  var images = svg.selectAll('image.asteroids')
              .data(data, function(d) {
                return d.id;
              });

  images.enter()
            .append('image')
            .attr('class', 'asteroids')
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


//drag
var mover = function() {
  d3.select('image.draggable')
    .attr('x', d3.event.x - parseInt(d3.select('image.draggable').attr('width')) / 2)
    .attr('y', d3.event.y - parseInt(d3.select('image.draggable').attr('height')) / 2);
};

var drag = d3.behavior.drag().on('drag', mover);

d3.select('image.draggable')
  .call(drag);




