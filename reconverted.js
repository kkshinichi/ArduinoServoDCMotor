var five = require("johnny-five"),
	board = new five.Board();

var valRead = 0;
var motorPWM = 0;
var error = 0; //difference between target value and input value
var valTarget;

const kp = 3; //proportionality constant
const mp = 20; //minimal power (pwm) to motor
const wireMT_1 = 5; //for wire motor H bridge
const wireMT_2 = 6; //for wire motor H bridge
const diff_error = 10; //max error to potentiometer motor
const minPot = 10;  //minimal input value
const maxPot = 1010; //max input value
const maxValIn = 511; //max *input value. For this case 1023, the max of pot.
// *here can use something like degress, where max could be 180

board.on("ready", function() {
	//setup
	var potMT = new five.Sensor("A0"); // motor potentiometer
	var potIn = new five.Sensor("A3"); // to be changed to web just for sample here (input potentio)
	var wireMT_1 = new five.Led(5); // wire motor to H bridge
	var wireMT_2 = new five.Led(6); // wire motor to H bridge

	wireMT_1.off();
	wireMT_2.off();

	function runMotor(valTarget){
		// proportionality between input and output values
		while ((valRead <= valTarget) && (abs(valRead - valTarget) > diff_error)) {
			potMT.on("change", function() {
				potMT = this.fscaleto(10,1010);
				valRead	= ((potMT - minPot) / (maxPot - minPot)) * maxValIn;
				// pwm proportional
				error = valTarget - valRead;
				motorPWM = ((kp * error) / 100) + mp;
			});
			wireMT_1.fadeIn(motorPWM);
			wireMT_2.off();
		}
		wireMT_1.off(); // turn off motor

		// proportionality between input and output value
		while ((valRead >= valTarget) && (abs(valRead - valTarget) > diff_error)) {
			potMT.on("change", function() {
				potMT = this.fscaleto(10,1010);
				valRead = ((potMT - minPot) / (maxPot - minPot)) * maxValIn;
				// pwm proportional
				error = valRead - valTarget;
				motorPWM = ((kp * error) / 100) + mp;
			});
			wireMT_2.fadeIn(motorPWM);
			wireMT_1.off();
		}
		wireMT_2.off() // turn off motor
	}

	potIn.on("change", function() {
		runMotor(this.value);
	})
});