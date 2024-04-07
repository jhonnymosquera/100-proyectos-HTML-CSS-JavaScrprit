/* escenario */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 448;
canvas.height = 400;

const sprite = document.querySelector('#sprite');
const brick = document.querySelector('#brick');

/* variables de nuestro juego */

/* VARIABLES DE LA PELOTA */
// radio de la pelota
const ballRadius = 3;
// posición de la pelota
let x = canvas.width / 2;
let y = canvas.height - 30;
// velocidad de la pelota
// numero aleatorio entre -2 y +2

/* VARIABLES DE LA PALETA */
const paddleHeight = 10;
const paddleWidth = 50;
const PADDLE_VELOCITY = 7;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

/* VARIABLES DE LOS LADRILLOS */

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;

const BRICK_STATUS = {
	ACTIVE: 1,
	DESTROYED: 0,
};
const random = () => Math.floor(Math.random() * 8);

for (let c = 0; c < brickColumnCount; c++) {
	brick[c] = []; // inicializamos con un array vacio
	for (let r = 0; r < brickRowCount; r++) {
		// calculamos la posicion del ladrillo en la pantalla
		const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
		const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
		// Asignar un color aleatorio a cada ladrillo
		const random = Math.floor(Math.random() * 8);
		// Guardamos la información de cada ladrillo
		brick[c][r] = {
			x: brickX,
			y: brickY,
			status: BRICK_STATUS.ACTIVE,
			color: random,
		};
	}
}

function randomNumber() {
	return Math.floor(Math.random() * 2) + -2;
}
const velocidad = randomNumber();
let dx = -velocidad;
let dy = -2;

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.drawImage(sprite, 29, 174, paddleWidth, paddleHeight, paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			const currentBrick = brick[c][r];
			if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

			const clipX = currentBrick.color * 32;

			ctx.drawImage(
				brick,
				clipX,
				0,
				brickWidth, // 31
				brickHeight, // 14
				currentBrick.x,
				currentBrick.y,
				brickWidth,
				brickHeight
			);
		}
	}
}

function drawScore() {}

function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			const currentBrick = brick[c][r];
			if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

			const isBallSameXasBrick = x > currentBrick.x && x < currentBrick.x + brickWidth;
			const isBallSameYasBrick = y > currentBrick.y && y < currentBrick.y + brickHeight;

			if (isBallSameXasBrick && isBallSameYasBrick) {
				dy = -dy;
				currentBrick.status = BRICK_STATUS.DESTROYED;
			}
		}
	}
}

function ballMovement() {
	// rebotar las pelotas en los laterales
	if (
		x + dx > canvas.width - ballRadius || // la pared derecha
		x + dx < ballRadius // la pared izquierda
	) {
		dx = -dx;
	}

	// rebotar en la pared de arriba
	if (y + dy < ballRadius) {
		dy = -dy;
	}

	const isBallSameXasPaddle = x > paddleX && x < paddleX + paddleWidth;
	const isBallSameYasPaddle = y + dy > paddleY && y < paddleY + paddleHeight;

	// la pelota toca la pala
	if (isBallSameXasPaddle && isBallSameYasPaddle) {
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		console.log('game over');

		document.location.reload();
	}

	x += dx;
	y += dy;
}

function paddleMovement() {
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += PADDLE_VELOCITY;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= PADDLE_VELOCITY;
	}
}

function cleanCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
	document.addEventListener('keydown', keyDownHandler);
	document.addEventListener('keyup', keyUpHandler);

	function keyDownHandler(event) {
		const { key } = event;

		if (key === 'Right' || key === 'ArrowRight') {
			rightPressed = true;
		} else if (key === 'Left' || key === 'ArrowLeft') {
			leftPressed = true;
		}
	}

	function keyUpHandler(event) {
		const { key } = event;

		if (key === 'Right' || key === 'ArrowRight') {
			rightPressed = false;
		} else if (key === 'Left' || key === 'ArrowLeft') {
			leftPressed = false;
		}
	}
}

function draw() {
	console.log({ rightPressed, leftPressed });
	cleanCanvas();
	// dibujar elementos
	drawBall();
	drawPaddle();
	drawBricks();
	// drawScore()

	// colisiones y movimientos
	collisionDetection();
	ballMovement();
	paddleMovement();

	window.requestAnimationFrame(draw);
}

draw();
initEvents();
