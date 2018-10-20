var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
	io: new raspi()
});

board.on('ready', function() {
	var toggle = new five.Switch(5);
	var servo = new five.Servo(1);
	this.repl.inject({
    servo: servo,
    toggle: toggle
  });

	toggle.on("close", function() {
		console.log("Going Up");
		servo.center();
	});
	toggle.on("open", function() {
		console.log("Going Down");
		servo.min();
	});
});

// 180-270