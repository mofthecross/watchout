// start slingin' some d3 here.

// create 10 svg elements
  // imgs will be set to asteroid.png

var data = [];

// width/height of board = 800
// width/height of asteroid = 50
// width/height of ship = 50
var boardWidth = 800;
var boardHeight = 800;

var asteroidWidth = Math.round(196 / 4);
var asteroidHeight = Math.round(196 / 4);

var shipWidth = Math.round(484 / 6);
var shipHeight = Math.round(292 / 6);

var numOfAsteroids = 10;

for (var i = 0; i < numOfAsteroids; i++) {
  data.push({'id': i,
            'x': Math.random() * (boardWidth - asteroidWidth),
            'y': Math.random() * (boardHeight - asteroidHeight)}
  );
}

// svg === game board
var svg = d3.select('div.board')
            .append('svg')
            .attr('width', boardWidth)
            .attr('height', boardHeight)
            .style('background-color', 'black');

var ship = svg
            .append('image')
            .attr('class', 'draggable')
            .attr('xlink:href', 'ship.png')
            .attr('x', boardWidth / 2 - shipWidth / 2)
            .attr('y', boardHeight / 2 - shipHeight / 2)
            .attr('height', shipHeight)
            .attr('width', shipWidth);

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
            .attr('height', asteroidHeight)
            .attr('width', asteroidWidth)
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
    data.map(function(asteroid) {
      asteroid.x = Math.random() * (boardWidth - asteroidWidth);
      asteroid.y = Math.random() * (boardHeight - asteroidHeight);
      return asteroid;
    })
  );
  currentScore();
  highScore();
}, 1000);


// drag 
var mover = function() {
  d3.select('image.draggable')
    .attr('x', function(d) {
      var newX = d3.event.x - shipWidth / 2;
      if (newX < 0) {
        return 0;
      } else {
        return Math.min(boardWidth - shipWidth, newX);
      }
    })
    .attr('y', function(d) {
      var newY = d3.event.y - shipHeight / 2;
      if (newY < 0) {
        return 0;
      } else {
        return Math.min(boardHeight - shipHeight, newY);
      }
    });
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











