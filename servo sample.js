var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
	io: new raspi()
});

board.on('ready', function() {
	var servo = new five.Servo(1);
	this.repl.inject({
    servo: servo
  });
	servo.center();
	board.wait(2000, function() {
		servo.min();
	});
});