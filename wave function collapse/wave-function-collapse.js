'use strict';

const tiles = [];
const tileImages = [];
let grid = [];

const DIM = 15; // Dimension

function preload() {
	const path = 'circuit';
	for (let i = 0; i < 13; i++) {
		tileImages[i] = loadImage(`./tiles/${path}/${i}.png`);
	}
}

function setup() {
	createCanvas(700, 650);

	// Loaded and created the tiles
	tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
	tiles[1] = new Tile(tileImages[1], ['BBB', 'BBB', 'BBB', 'BBB']);
	tiles[2] = new Tile(tileImages[2], ['BCB', 'BCB', 'BBB', 'BBB']);
	tiles[3] = new Tile(tileImages[3], ['BBB', 'BDB', 'BBB', 'BDB']);
	tiles[4] = new Tile(tileImages[4], ['ABB', 'BCB', 'BBA', 'AAA']);
	tiles[5] = new Tile(tileImages[5], ['ABB', 'BBB', 'BBB', 'BBA']);
	tiles[6] = new Tile(tileImages[6], ['BBB', 'BCB', 'BBB', 'BCB']);
	tiles[7] = new Tile(tileImages[7], ['BDB', 'BCB', 'BDB', 'BCB']);
	tiles[8] = new Tile(tileImages[8], ['BDB', 'BBB', 'BCB', 'BBB']);
	tiles[9] = new Tile(tileImages[9], ['BCB', 'BCB', 'BBB', 'BCB']);
	tiles[10] = new Tile(tileImages[10], ['BCB', 'BCB', 'BCB', 'BCB']);
	tiles[11] = new Tile(tileImages[11], ['BCB', 'BCB', 'BBB', 'BBB']);
	tiles[12] = new Tile(tileImages[12], ['BBB', 'BCB', 'BBB', 'BCB']);

	for (let i = 2; i < 14; i++) {
		for (let j = 1; j < 4; j++) {
			tiles.push(tiles[i].rotate(j));
		}
	}

	// Generate the adjacency rules
	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];
		tile.analyze(tiles);
	}

	startOver();
}

function startOver() {
	// Create cell for each spot on the grid
	for (let i = 0; i < DIM * DIM; i++) {
		grid[i] = new Cell(tiles.length);
	}
}

function checkValid(arr, valid) {
	for (let i = arr.length - 1; i >= 0; i--) {
		const element = arr[i];
		if (!valid.includes(element)) {
			arr.splice(i, 1);
		}
	}
}

function mousePressed() {
	redraw();
}

function draw() {
	background(0);

	const w = width / DIM;
	const h = height / DIM;
	for (let j = 0; j < DIM; j++) {
		for (let i = 0; i < DIM; i++) {
			const cell = grid[i + j * DIM];
			if (cell.collapsed) {
				const index = cell.options[0];
				image(tiles[index].img, i * w, j * h, w, h);
			} else {
				fill(0);
				stroke(255);
				rect(i * w, j * h, w, h);
			}
		}
	}

	// Pick cell with least entropy
	let gridCopy = grid.slice();
	gridCopy = gridCopy.filter((a) => !a.collapsed);

	if (gridCopy.length === 0) return;

	const len = gridCopy[0].options.length;
	let stopIndex = 0;
	for (let i = 1; i < gridCopy.length; i++) {
		if (gridCopy[i].options.length > len) {
			stopIndex = i;
			break;
		}
	}

	if (stopIndex > 0) gridCopy.splice(stopIndex);
	const cell = random(gridCopy);
	cell.collapsed = true;
	const pick = random(cell.options);
	if (pick === undefined) {
		startOver();
		return;
	}
	cell.options = [pick];

	const nextGrid = [];
	for (let j = 0; j < DIM; j++) {
		for (let i = 0; i < DIM; i++) {
			const index = i + j * DIM;
			if (grid[index].collapsed) {
				nextGrid[index] = grid[index];
			} else {
				const options = new Array(tiles.length).fill(0).map((_, i) => i);
				// Look Up
				if (j > 0) {
					let validOptions = [];
					const up = grid[i + (j - 1) * DIM];
					for (const option of up.options) {
						const valid = tiles[option].down;
						validOptions = validOptions.concat(valid);
					}
					checkValid(options, validOptions);
				}
				// Look Right
				if (i < DIM - 1) {
					let validOptions = [];
					const right = grid[i + 1 + j * DIM];
					for (const option of right.options) {
						const valid = tiles[option].left;
						validOptions = validOptions.concat(valid);
					}
					checkValid(options, validOptions);
				}
				// Look Down
				if (j < DIM - 1) {
					let validOptions = [];
					const down = grid[i + (j + 1) * DIM];
					for (const option of down.options) {
						const valid = tiles[option].up;
						validOptions = validOptions.concat(valid);
					}
					checkValid(options, validOptions);
				}
				// Look Left
				if (i > 0) {
					let validOptions = [];
					const left = grid[i - 1 + j * DIM];
					for (const option of left.options) {
						const valid = tiles[option].right;
						validOptions = validOptions.concat(valid);
					}
					checkValid(options, validOptions);
				}
				// I could immediately collapse if only one option left?
				nextGrid[index] = new Cell(options);
			}
		}
	}
	grid = nextGrid;
}
