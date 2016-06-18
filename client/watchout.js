// start slingin' some d3 here.

// create 10 svg elements
  // imgs will be set to asteroid.png

var data = [];

// width/height of board = 800
// width/height of asteroid = 50
// width/height of ship = 50
var width = 800 - 50;
var height = 800 - 50;

var numOfAsteroids = 10;

for (var i = 0; i < numOfAsteroids; i++) {
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
            .attr('height', 70)
            .attr('width', 70);

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

  images.transition().duration(1000).attr('x', function(d) {
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
  currentScore();
  highScore();
}, 1000);


// drag 
var mover = function() {
  d3.select('image.draggable')
    .attr('x', d3.event.x - parseInt(d3.select('image.draggable').attr('width')) / 2)
    .attr('y', d3.event.y - parseInt(d3.select('image.draggable').attr('height')) / 2);
};

var drag = d3.behavior.drag().on('drag', mover);

d3.select('image.draggable')
  .call(drag);


// collisions
var intersectRect = function(r1, r2) {
  var r1 = r1.getBoundingClientRect();    //BOUNDING BOX OF THE FIRST OBJECT
  var r2 = r2.getBoundingClientRect();    //BOUNDING BOX OF THE SECOND OBJECT
 
  //CHECK IF THE TWO BOUNDING BOXES OVERLAP
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
};

var collision = 0;
var flag = false;

setInterval(function() {
  // check collision
  var asteroids = d3.selectAll('image.asteroids');
  var ship = d3.select('image.draggable');

  if (flag) {
    return;
  }

  for (var i = 0; i < asteroids[0].length; i++) {
    if (intersectRect(ship[0][0], asteroids[0][i])) {
      collision++;
      if (collision === 5) {
        collision = 0;
        highscore = current;
        current = 0;
        frozen = true;
        d3.select('.current span').data([current]).text(function(d) {
          return d;
        });
      }
      flag = true;
      setTimeout(function() {
        flag = false;
      }, 400);
      d3.select('.collisions span').data([collision]).text(function(d) {
        return d;
      });
      return;
    }
  }
}, 100);


var current = 0;
var highscore = 0;
var currentScore = function() {
  current++;
  if (current > highscore) {
    frozen = false;
  }
  d3.select('.current span').data([current]).text(function(d) {
    return d;
  });
};

var frozen = false;
var highScore = function() {
  if (frozen) {
    return;
  }
  d3.select('.highscore span').data([current]).text(function(d) {
    return d;
  });

};











