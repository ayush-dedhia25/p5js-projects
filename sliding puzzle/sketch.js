'use strict';

let source;

const tiles = [];
const board = [];
const COLS = 4;
const ROWS = 4;
let w, h;
let blankSpot = -1;

function preload() {
	source = loadImage('./myself.jpg');
}

function setup() {
	createCanvas(640, 640);
	w = width / COLS;
	h = height / ROWS;

	for (let i = 0; i < COLS; i++) {
		for (let j = 0; j < ROWS; j++) {
			const x = i * w;
			const y = j * h;
			const img = createImage(w, h);
			img.copy(source, x, y, w, h, 0, 0, w, h);
			const index = i + j * COLS;
			board.push(index);
			const tile = new Tile(index, img);
			tiles.push(tile);
		}
	}

	tiles.pop();
	board.pop();
	board.push(-1);

	simpleShuffle(board);
}

function mousePressed() {
	const i = floor(mouseX / w);
	const j = floor(mouseY / h);
	move(i, j, board);
}

function draw() {
	background(0);

	for (let i = 0; i < COLS; i++) {
		for (let j = 0; j < ROWS; j++) {
			const index = i + j * COLS;
			const x = i * w;
			const y = j * h;
			const tileIndex = board[index];
			if (tileIndex > -1) {
				const img = tiles[tileIndex].img;
				image(img, x, y, w, h);
			}
		}
	}

	for (let i = 0; i < COLS; i++) {
		for (let j = 0; j < ROWS; j++) {
			const x = i * w;
			const y = j * h;
			strokeWeight(2);
			noFill();
			rect(x, y, w, h);
		}
	}

	if (isSolved()) {
		console.log('Solved');
	}
}

function isSolved() {
	for (let i = 0; i < board.length - 1; i++) {
		if (board[i] !== tiles[i].index) return false;
		return true;
	}
}

function randomMove(arr) {
	const r1 = floor(random(COLS));
	const r2 = floor(random(ROWS));
	move(r1, r2, arr);
}

function simpleShuffle(arr) {
	for (let i = 0; i < 100; i++) {
		randomMove(arr);
	}
}

function swap(i, j, arr) {
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

function move(i, j, arr) {
	const blank = findBlank();
	const blankCol = blank % COLS;
	const blankRow = floor(blank / ROWS);
	if (isNeighbor(i, j, blankCol, blankRow)) {
		swap(blank, i + j * COLS, arr);
	}
}

function findBlank(i, j) {
	for (let i = 0; i < board.length; i++) {
		if (board[i] === -1) return i;
	}
}

function isNeighbor(i, j, x, y) {
	if (i !== x && j !== y) return false;
	if (abs(i - x) === 1 || abs(j - y) === 1) return true;
	return false;
}
