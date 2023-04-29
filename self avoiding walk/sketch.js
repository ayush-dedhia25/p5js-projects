'use strict';

let grid;
let COLS, ROWS;
let spot;

const spacing = 50;
const allOptions = [
	{ dx: 1, dy: 0, tried: false },
	{ dx: -1, dy: 0, tried: false },
	{ dx: 0, dy: 1, tried: false },
	{ dx: 0, dy: -1, tried: false },
];
const path = [];

function make2DArray(cols, rows) {
	const arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

function setup() {
	createCanvas(500, 500);
	COLS = floor(width / spacing);
	ROWS = floor(height / spacing);
	background(0);
	grid = make2DArray(COLS, ROWS);
	for (let i = 0; i < COLS; i++) {
		for (let j = 0; j < ROWS; j++) {
			grid[i][j] = new Spot(i, j);
		}
	}
	spot = grid[0][0];
	path.push(spot);
	spot.visited = true;
	// frameRate(1);
}

function isValid(i, j) {
	if (i < 0 || i >= COLS || j < 0 || j >= ROWS) return false;
	return !grid[i][j].visited;
}

function draw() {
	background(0);
	translate(spacing * 0.5, spacing * 0.5);

	for (let i = 0; i < 1000; i++) {
		spot = spot.nextSpot();
		if (!spot) {
			const stuck = path.pop();
			stuck.clear();
			spot = path[path.length - 1];
		} else {
			path.push(spot);
			spot.visited = true;
		}

		if (path.length === COLS * ROWS) {
			console.log('Solved');
			noLoop();
			break;
		}
	}

	stroke(255);
	strokeWeight(spacing * 0.25);
	noFill();
	beginShape();
	for (const spot of path) {
		vertex(spot.x, spot.y);
	}
	endShape();
	stroke(255);
	strokeWeight(spacing * 0.5);
	point(spot.x, spot.y);
}
