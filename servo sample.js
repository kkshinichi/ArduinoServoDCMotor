var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
	io: new raspi()
});

board.on('ready', function() {
	var up = new five.Button(4);
	var down = new five.Button(5);
	var servo = new five.Servo(1);
	this.repl.inject({
    servo: servo,
    button: up,
    button: down
  });

	up.on("down", function() {
		console.log("Going Down.");
		servo.min();
	});
	down.on("down", function() {
		console.log("Going Up");
		servo.center();
	});


	// servo.center();
	// board.wait(2000, function() {
	// 	servo.min();
	// });
});