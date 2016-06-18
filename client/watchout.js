/*
  Constant Variables
*/
var boardWidth = 800;
var boardHeight = 800;

var asteroidWidth = Math.round(196 / 4);
var asteroidHeight = Math.round(196 / 4);

var shipWidth = Math.round(484 / 6);
var shipHeight = Math.round(292 / 6);

var numOfAsteroids = 10;

// How often the location of the asteroids are updated (in ms)
var timeIntervalForAsteroids = 1200;

// Time duration for asteroids to move to new location (in ms)
var transitionForAsteroids = timeIntervalForAsteroids * 1;

// How often we check for collisions between ship and asteroids (in ms)
var timeIntervalForCollisionCheck = 100;

// Once a collision is registered, the buffer period until next collision check (in ms)
var timeoutForCollisionCheck = 700;

// Game Over when the collision count reaches this number
var maxNumOfCollisions = 5;


/*
  Start building game board
*/
// svg is the gameboard
var svg = d3.select('div.board')
            .append('svg')
            .attr('width', boardWidth)
            .attr('height', boardHeight);

// Add ship to the board
var ship = svg
            .append('image')
            .attr('class', 'draggable')
            .attr('xlink:href', 'ship.png')
            .attr('x', boardWidth / 2 - shipWidth / 2)
            .attr('y', boardHeight / 2 - shipHeight / 2)
            .attr('height', shipHeight)
            .attr('width', shipWidth);

// Updates the location of the asteroids
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

  images.transition().duration(transitionForAsteroids).attr('x', function(d) {
    return d.x;
  })
  .attr('y', function(d) {
    return d.y;
  });

};

// Initialize array of asteroidData objects
var asteroidsData = [];
for (var i = 0; i < numOfAsteroids; i++) {
  asteroidsData.push({'id': i,
            'x': Math.random() * (boardWidth - asteroidWidth),
            'y': Math.random() * (boardHeight - asteroidHeight)}
  );
}

// Add asteroids to the board
update(asteroidsData);


/*
  Update 
    1) the location of the asteroids
    2) Current score
    3) High score 
*/
setInterval(function() {
  update(
    asteroidsData.map(function(asteroid) {
      asteroid.x = Math.random() * (boardWidth - asteroidWidth);
      asteroid.y = Math.random() * (boardHeight - asteroidHeight);
      return asteroid;
    })
  );
  currentScore();
  highScore();
}, timeIntervalForAsteroids);


/*
  Draggable
    make the ship draggable
*/
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


/*
  Collisions
    register collisions between ship and asteroids
*/

// Helper function that takes two Document Elements 
// and returns a boolean reflecting whether the two elements 
// physcially overlap
var intersectRect = function(r1, r2) {
  var r1 = r1.getBoundingClientRect();    // bounding box of the first object
  var r2 = r2.getBoundingClientRect();    // bounding box of the second object
 
  // check if the two bounding boxes overlap
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
};

var collision = 0;

// Denotes whether collisions are currently being ignored due to the buffer period 
var flag = false;

setInterval(function() {

  // check collision
  var asteroids = d3.selectAll('image.asteroids');
  var ship = d3.select('image.draggable');

  if (flag) {
    return;
  }

  d3.select('.collisions').classed('flash', false);

  for (var i = 0; i < asteroids[0].length; i++) {
    if (intersectRect(ship[0][0], asteroids[0][i])) {
      // flash the background red when collision occurs
      d3.select('.collisions').classed('flash', true);

      // start buffer period for collisions
      flag = true;

      // set timer to end buffer period
      setTimeout(function() {
        flag = false;
      }, timeoutForCollisionCheck);
      
      collision++;

      // Game Over
      if (collision === maxNumOfCollisions) {
        collision = 0;
        highscore = current;
        frozen = true;
        current = 0;
        d3.select('.current span').data([current]).text(function(d) {
          return d;
        });
      }

      // update collision number on screen
      d3.select('.collisions span').data([collision]).text(function(d) {
        return d;
      });

      return;
    }
  }
}, timeIntervalForCollisionCheck);


/*
  Update Current score and High score
*/
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

// Flag to track whether highScore is frozen or increasing
var frozen = false;

var highScore = function() {
  if (frozen) {
    return;
  }
  d3.select('.highscore span').data([current]).text(function(d) {
    return d;
  });
};

