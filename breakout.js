// ~~~~~~~~~~~~game ticks
var animate = window.requestAnimationFrame ||
 	window.webkitRequestAnimationFrame ||
 	window.mozRequestAnimationFrame ||
	function(callback) { window.setTimeout(callback, 1000/60) };


// ~~~~~~~~~~~~canvas
var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var player = new Player();
var ball = new Ball(200, 300);
var ball_radius = 5;

window.onload = function() {
	document.body.appendChild(canvas);
	animate(step);
};

var step = function() {
	update();
	render();
	animate(step);
};

var render = function() {
  context.fillStyle = "#303030";
  context.fillRect(0, 0, width, height);
  player.render();
  ball.render();
  for (var r = 0; r < rows; r++)
  {
	for (var c = 0; c < columns; c++)
	{
		bricks[r][c].render();
	}
  }  
};

var update = function() {
	player.update();
	ball.update(player.paddle);
  };


// ~~~~~~~~~~~~paddle
function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}
  
Paddle.prototype.render = function() {
	context.fillStyle = "#2AAFBF";
	context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;
	if(this.x < 0) { // all the way to the left
	  this.x = 0;
	  this.x_speed = 0;
	} else if (this.x + this.width > 400) { // all the way to the right
	  this.x = 400 - this.width;
	  this.x_speed = 0;
	}
  }

function Player() {
	this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function() {
	this.paddle.render();
};

Player.prototype.update = function() {
	for(var key in keysDown) {
	  var value = Number(key);
	  if(value == 37) { // left arrow
		this.paddle.move(-4, 0);
	  } else if (value == 39) { // right arrow
		this.paddle.move(4, 0);
	  } else {
		this.paddle.move(0, 0);
	  }
	}
  };
  
  


// ~~~~~~~~~~~~ball
function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 5;
}
  
  Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
	context.fillStyle = "#FFFFFF";
	context.fill();
};

Ball.prototype.update = function(paddle1) {
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 5;
	var top_y = this.y - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;
  
	if(this.x - 5 < 0) { // hitting the left wall
	  this.x = 5;
	  this.x_speed = -this.x_speed;
	}
	else if(this.x + 5 > 400) { // hitting the right wall
	  this.x = 395;
	  this.x_speed = -this.x_speed;
	}
	// hitting the top
	else if (this.y - 5 < 0)
	{
		this.y = 5;
		this.y_speed = -this.y_speed;
	}
  
	if(this.y < 0 || this.y > 600) { // a point was scored
	  this.x_speed = 0;
	  this.y_speed = 3;
	  this.x = 200;
	  this.y = 300;
	}
  
	if(top_y > 300) {
	  if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
		// hit the player's paddle
		this.y_speed = -3;
		this.x_speed += (paddle1.x_speed / 2);
		this.y += this.y_speed;
	  }
	}
};

// ~~~~~~~~~~~~~keyboard
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bricks
var brick_w = 50;
var brick_h = 10;
var rows = 3;
var columns = 4;

function Brick(x, y) {
	this.x = x;
	this.y = y;
	this.isAlive = true;
}

var bricks = [];
for (var r = 0; r < rows; r++)
{
	bricks[r] = [];
	for (var c = 0; c < columns; c++)
	{
		bricks[r][c] = new Brick(70 + r*2*this.brick_w, 70 + c*4*this.brick_h);
	}
}

Brick.prototype.render = function() {
	context.fillStyle = "#FF463F";
	context.fillRect(this.x, this.y, 50, 10);//this.brick_w, this.brick_h);
};

/*Brick.prototype.check = function(x, y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;
	if(this.x < 0) { // all the way to the left
	  this.x = 0;
	  this.x_speed = 0;
	} else if (this.x + this.width > 400) { // all the way to the right
	  this.x = 400 - this.width;
	  this.x_speed = 0;
	}
  }*/

  