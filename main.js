/*
	---------------
     ▜▘▞▀▖▗▌ ▞▀▖▌ ▌
     ▐ ▚▄  ▌  ▄▘▙▞  CHALLENGE
    ▌▐ ▖ ▌ ▌ ▖ ▌▌▝▖
    ▝▘ ▝▀ ▝▀ ▝▀ ▘ ▘
	---------------

	The Water Tap Game

	░█▄█░█▀█░▀█▀░█▀█░░░█▀▄░█▀█░█▀▄░█░█
	░█░█░█▀█░░█░░█░█░░░█▀▄░█░█░█░█░░█░
	░▀░▀░▀░▀░▀▀▀░▀░▀░░░▀▀░░▀▀▀░▀▀░░░▀░
*/

//all Events - object that holds the key pressed
var keysDown = {};
addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);

//-----GLOBALS-----//
var canvas, ctx, mobile, state, ro,ra,wat,pX,pY,isD,
redO, blueO, si,d1,d2,
wid,
speed,
between_level_counter=0,
between_level_max_counter=5,
beated_levels = 0,
between_level_current_d,
between_level_current_d_pos=0;
//-----GLOBALS END-----//


var initialize = function() {
	var element = document.getElementById('game');
	canvas = element.firstElementChild;
	// Setting up the canvas
	ctx = canvas.getContext('2d');
	ro = ra = wat = state = pX = pY = 0;

	redO = Math.random()*0.7+0.2;
	blueO = Math.random()*0.7+0.2;
	si = (Math.random()>0.5); //decides which controls hot or cold
	d1 = (Math.random()>0.5); //decides the rotation of the left handle
	d2 = (Math.random()>0.5); //decides the rotation of the right handle
	wid = 15;
	speed = 0.10;

	isD = false;
	canvas.addEventListener('mousedown', function(e){handleEvent(e)}, false);
	canvas.addEventListener('mouseup', function(e){handleEvent(e)}, false);
	canvas.addEventListener('mousemove', function(e){handleEvent(e)}, false);
	canvas.addEventListener('touchstart', function(e){handleEvent(e)}, false);
	canvas.addEventListener('touchend', function(e){handleEvent(e)}, false);
	canvas.addEventListener('touchleave', function(e){handleEvent(e)}, false);
	canvas.addEventListener('touchmove', function(e){handleEvent(e)}, false);
}


function updateLevel() {
	ro = ra = wat = state = pX = pY = 0;
	redO = Math.random()*0.7+0.2;
	blueO = Math.random()*0.7+0.2;
	si = (Math.random()>0.5); //decides which controls hot or cold
	d1 = (Math.random()>0.5); //decides the rotation of the left handle
	d2 = (Math.random()>0.5); //decides the rotation of the right handle
	wid = 15;
	speed += 0.01;
	isD = false;
}


function changeAlpha(x,a) {
	if (x) {
		a += 0.01;
		(a > 0.8) ? a = 0.8:0;
	}
	else {
		a -= 0.01;
		(a < 0) ? a = 0:0;
	}
	return a;
}

function updateWater(up, handle) {
	if(state !== 0) return;
	if ( (up && d1 && handle) ||
			(!up && !d1 && handle) ) { //increasing handle 1
		if (si) {
			redO = changeAlpha(true,redO);
			if (redO < 0.8) {
				up? ro+= 0.1: ro-=0.1;
			}
		}
		else {
			blueO = changeAlpha(true,blueO);
			if (blueO < 0.8) {
				up? ro+= 0.1: ro-=0.1;
			}
		}
	}
	if ( (up && !d1 && handle) ||
			(!up && d1 && handle)) {
		if (si) {
			redO = changeAlpha(false,redO);
			if (redO >0){
				up? ro+= 0.1: ro-=0.1;
			}
		}
		else {
			blueO = changeAlpha(false,blueO);
			if (blueO >0){
				up? ro+= 0.1: ro-=0.1;
			}
		}
	}
	if ( (up && d1 && !handle) ||
		(!up && !d1 && !handle) ) { //increasing handle 2
		if (!si) {
			redO = changeAlpha(true,redO);
			if (redO < 0.8){
				up? ra+= 0.1: ra-=0.1;
			}
		}
		else {
			blueO = changeAlpha(true,blueO);
			if (blueO < 0.8){
				up? ra+= 0.1: ra-=0.1;
			}
		}
	}
	if ( (up && !d1 && !handle) ||
		(!up && d1 && !handle)) {
		if (!si) {
			redO = changeAlpha(false,redO);
			if (redO >0){
				up? ra+= 0.1: ra-=0.1;
			}
		}
		else {
			blueO = changeAlpha(false,blueO);
			if (blueO >0){
				up? ra+= 0.1: ra-=0.1;
			}
		}
	}
}


var handleEvent = function(evt) {
	evt.preventDefault();
	var touches = evt.changedTouches;
	if (state == 0) {
		switch (evt.type) {
			case 'mousedown':
			case 'touchstart':
				isD = true;
				if (touches) {
					pX = touches[0].pageX;
					pY = touches[0].pageY;
				}
				else {
					pX = evt.pageX;
					pY = evt.pageY;
				}
			break;
			case 'mousemove':
			case 'touchmove':
				if (isD) { //when the pointer is down
					var diff;
					(touches)?diff = pY - touches[0].pageY:diff = pY - evt.pageY;
					if (Math.abs(diff) > 5) {
						if (pX > 160) { //the right handle
							(diff>0)?updateWater(true,false):updateWater(false,false);
						}
						else {
							(diff>0)?updateWater(true,true):updateWater(false,true);
						}
						touches ? pY = touches[0].pageY : evt.pageY;
					}
				}
			break;
			case 'mouseup':
			case 'touchend':
			case 'touchleave':
				isD = false;
			break
		}
	}
	else if (state == -1) { //main menu
		switch (evt.type) {
			case 'mousedown':
			case 'touchstart':
				state = 0;
			break;
		}
	}
	else if (state == 2 || state == 4) {
		switch (evt.type) {
			case 'mousedown':
			case 'touchstart':
				initialize();
				beated_levels = 0;
				(state == 2)?state = 0:state = -1;

			break;
		}
	}
}


//the game loop that runs 60/s
var run = function () {
	initialize();
	state = -1;
	requestAnimationFrame(loop);
}

var update = function(animStart) {
	//update position and rotation of the car
	//check colision
	if (state == 0) {
		if (keysDown[37]) { //left
			updateWater(true, true);
		}
		if (keysDown[39]) { //right
			updateWater(false, true);
		}
		if (keysDown[38]) { //up
			updateWater(true, false);
		}
		if (keysDown[40]) { //down
			updateWater(false,false);
		}
		if (wat > 480) {
			state = 2; //game over
		}
		else {
			(wid != 0)?wat += speed*wid:0;
		}
	}
	else if (state == 1) {
		between_level_counter++;
		between_level_current_d_pos += 4;
		if(Math.floor(between_level_counter/60) >= between_level_max_counter){

			between_level_counter = 0;
			between_level_current_d_pos = 0;
			if (beated_levels == 10) {
				state = 4;
			}
			else {
				updateLevel(); //next difficulty
			}
		}
	}

	wid = (redO+blueO)*9;
	if (state == 0 && wid == 0) { //water stopped
		beated_levels++;
		state = 1;
	}
}


function drawHandle(x,r) {
	var w = 24,
	s = 10,
	k = 8;
	ctx.translate(x,130);
	ctx.rotate(r);
	ctx.translate(-5,-13);

	ctx.beginPath();
	ctx.moveTo(0,0);

	ctx.lineTo(0,-w);
	//ctx.lineTo(s,-w); //this needs to be changed
	//
	ctx.quadraticCurveTo(-5,-w-13,s-5,-w-15);
	ctx.quadraticCurveTo(s+5,-w-13,s,-w);
	//
	ctx.lineTo(s,0);
	ctx.lineTo(s+k,k);

	ctx.lineTo(s+k+w,k);
	//ctx.lineTo(s+k+w,k+s); //this needs to be changed
	//
	ctx.quadraticCurveTo(s+k+w+13,k-5, s+k+w+15,k+s-5);
	ctx.quadraticCurveTo(s+k+w+13,k+15,s+k+w,k+s);
	//
	ctx.lineTo(s+k,k+s);
	ctx.lineTo(s,s+2*k);

	ctx.lineTo(s,s+2*k+w);
	//ctx.lineTo(0,s+2*k+w); //this needs to be changed
	//
	ctx.quadraticCurveTo(15,s+2*k+w+13, 5,s+2*k+w+15);
	ctx.quadraticCurveTo(-5,s+2*k+w+13, 0,s+2*k+w);
	//
	ctx.lineTo(0,s+2*k);
	ctx.lineTo(-k,s+k);

	ctx.lineTo(-k-w,k+s);
	//ctx.lineTo(-k-w,k);  //this needs to be changed
	//
	ctx.quadraticCurveTo(-k-w-13, k+15, -k-w-15,k+5);
	ctx.quadraticCurveTo(-k-w-13, k-5, -k-w,k);
	//
	ctx.lineTo(-k,k);
	ctx.closePath();

	ctx.stroke();

	ctx.translate(5,13);
	ctx.rotate(-r);
	ctx.translate(-x,-130);
}


function drawTap() {
	//nice broken white "scheme complementary"
	ctx.shadowBlur = 2;
	ctx.shadowColor = "#606060";

	ctx.shadowBlur = 1;
	ctx.fillStyle = '#E7D4C3';
	ctx.strokeStyle = '#E7D4C3';

	//simple line at the top
	ctx.fillRect(80,120,80*2,3);


	//the end of the tap
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.moveTo(80, 150);
	ctx.quadraticCurveTo(150,170,145,270);
	ctx.quadraticCurveTo(160,300,175,270);
	ctx.quadraticCurveTo(170,170,160+80, 150);
	ctx.stroke();

	//the handles
	drawHandle(70,ro);
	drawHandle(250,ra);

	//lol
	ctx.font = "18px sans-serif";
	ctx.fillStyle = '#212121';
	ctx.fillText("The Water Tap Game", 60, 20);
}


function drawWater() {
	var r = Math.floor(Math.random()*wid+5);
	(wid == 0)? r = 0: 0;
	ctx.fillStyle = "#14AFF1";
	ctx.fillRect(160-r/2,285, r, 250);

	ctx.globalAlpha = redO;
	ctx.fillStyle = "#F15614";
	ctx.fillRect(160-r/2,285, r, 250);

	ctx.globalAlpha = blueO;
	ctx.fillStyle = "#005577";
	ctx.fillRect(160-r/2,285, r, 250);

	ctx.globalAlpha = 1;
	/*

	ctx.strokeStyle = "#005577";

	ctx.beginPath();
	ctx.moveTo(150,280);
	for (var i=280;i<470;) {
		var r = Math.floor(Math.random()*7+1)+i,
			r2 = Math.floor(Math.random()*5+1)+r;
		i = r2;
		ctx.quadraticCurveTo(
			Math.floor(Math.random()*10)+135,
			r,
			Math.floor(Math.random()*15+1)+140,
			r2
		);
		ctx.quadraticCurveTo(
			Math.floor(Math.random()*30)+135,
			r,
			155,
			r2
		);
	}
	ctx.quadraticCurveTo(
		Math.floor(Math.random()*20)+110,
		Math.floor(Math.random()*10)+440,
		Math.floor(Math.random()*15+1)+120,
		Math.floor(Math.random()*10+1)+440
	);
	ctx.quadraticCurveTo(
		Math.floor(Math.random()*30)+130,
		Math.floor(Math.random()*50)+430,
		130,
		Math.floor(Math.random()*10)+460
	);
	for (var i=130; i>10;) {
		var r = i-Math.floor(Math.random()*7+1),
			r2 = r-Math.floor(Math.random()*30+1);
		i = r2;
		ctx.quadraticCurveTo(
			r,
			Math.floor(Math.random()*10)+450,
			r2,
			Math.floor(Math.random()*15+1)+450
		);
		ctx.quadraticCurveTo(
			r,
			Math.floor(Math.random()*30)+450,
			r2,
			Math.floor(Math.random()*10)+440
		);
	}
	ctx.quadraticCurveTo(
		Math.floor(Math.random()*3)+13,
		Math.floor(Math.random()*30)+450,
		0,
		Math.floor(Math.random()*50)+430
	);
	ctx.stroke();

	/*
	ctx.beginPath();
	ctx.moveTo(170,280);
	for (var i=280;i<470;) {
		var r = Math.floor(Math.random()*7+1)+i,
			r2 = Math.floor(Math.random()*5+1)+r;
		i = r2;
		ctx.quadraticCurveTo(
			Math.floor(Math.random()*15+1)+155,
			r2,
			Math.floor(Math.random()*10)+165,
			r
		);
		ctx.quadraticCurveTo(
			Math.floor(Math.random()*30)+165,
			r,
			165,
			r2
		);
	}
	ctx.quadraticCurveTo(
		Math.floor(Math.random()*20)+110,
		Math.floor(Math.random()*10)+440,
		Math.floor(Math.random()*15+1)+120,
		Math.floor(Math.random()*10+1)+440
	);
	ctx.quadraticCurveTo(
		Math.floor(Math.random()*30)+130,
		Math.floor(Math.random()*50)+430,
		130,
		Math.floor(Math.random()*10)+460
	);
	for (var i=130; i>10;) {
		var r = i-Math.floor(Math.random()*7+1),
			r2 = r-Math.floor(Math.random()*30+1);
		i = r2;
		ctx.quadraticCurveTo(
			r,
			Math.floor(Math.random()*10)+450,
			r2,
			Math.floor(Math.random()*15+1)+450
		);
		ctx.quadraticCurveTo(
			r,
			Math.floor(Math.random()*30)+450,
			r2,
			Math.floor(Math.random()*10)+440
		);
	}
	ctx.quadraticCurveTo(
		Math.floor(Math.random()*3)+13,
		Math.floor(Math.random()*30)+450,
		0,
		Math.floor(Math.random()*50)+430
	);
	ctx.stroke();
	*/

	//ctx.scale(-1,1);
	ctx.shadowBlur = 2;
}


function drawFillWater() {
	//here goes the special color with magnificent opacity mechanism
	ctx.shadowBlur = 10;
	ctx.shadowColor = "#212121";

	ctx.fillStyle = "#000088";
	ctx.fillRect(0,480-wat,320,480);

	ctx.shadowBlur = 2;
	ctx.shadowColor = "#606060";
}


function drawMainMenu() {
	drawTap();
	ctx.font = "18px sans-serif";
	ctx.fillStyle = "#000088";
	ctx.fillText("Stop the water before it fills the screen", 5, 220);
	ctx.fillRect(7,230,305,10);
	ctx.fillStyle = "#212121";
	ctx.fillText("Tap anywhere to start", 60, 260);
}


function drawWonScreen() {
	ctx.fillStyle = "#212121";

	ctx.font = "18px sans-serif";
	ctx.fillText("   Prepare Yourself!   ", 60, 260);
	ctx.fillText("        Round:    "+beated_levels+"    ", 60, 200);

	ctx.font = "50px sans-serif";
	var c = Math.floor(between_level_max_counter-between_level_counter/60);
	if (between_level_current_d != c) {
		between_level_current_d_pos = 0;
		between_level_current_d = c;
	}
	ctx.fillText(Math.floor(between_level_max_counter-between_level_counter/60), 135,550-between_level_current_d_pos);
}


function drawGameOver() {
	drawTap();
	ctx.font = "18px sans-serif";
	ctx.fillStyle = "#000088";
	var s = "   You could stop the water "+beated_levels+" time"+((beated_levels>1)?"s":"");
	ctx.fillText(s, 5, 220);
	ctx.fillRect(7,230,305,10);
	ctx.fillStyle = "#212121";
	ctx.fillText("Tap anywhere to restart", 58, 260);
}


function drawSpecial() {
	drawWater();
	drawTap();
	//maybe remove
	ctx.fillStyle = '#E7D4C3';
	ctx.strokeStyle = '#E7D4C3';
	ctx.beginPath();
	ctx.moveTo(135,270);
	ctx.quadraticCurveTo(160,330,185,270);
	ctx.closePath();
	ctx.fill();
	ctx.arc(70, 130, 53, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(250, 130, 53, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.fillRect(159,290,3,10);

	ctx.font = "50px sans-serif";
	ctx.fillStyle = "#000088";
	ctx.fillText("YES", 105, 220);
	ctx.fillRect(7,230,305,10);
	ctx.font = "18px sans-serif";
	ctx.fillStyle = "#212121";
	ctx.fillText("This looks like a dick!", 58, 260);
}


var draw = function() {
	ctx.fillStyle = '#C3D9E7';
	ctx.fillRect(0,0,320,480);
	if (state == 0) {
		drawFillWater();
		drawWater();
		drawTap();
	}
	else if (state == -1) {
		drawMainMenu();
	}
	else if (state == 1) { //won screen
		drawWonScreen();
	}
	else if (state == 2) { //game over
		drawGameOver();
	}
	else if (state == 4) { //special guest mr.potato
		drawSpecial();
	}
}


var loop = function(animStart) {
	update(animStart);
	draw();
	requestAnimationFrame(loop);
}


run();
