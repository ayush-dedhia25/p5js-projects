'use strict';

const t = 20;
const len = 5;
let total = 0;
let intersecting = 0;

let pieDiv;

function setup() {
	createCanvas(800, 500);
	background(0);
	for (let col = 0; col < width; col += t) {
		stroke(255);
		strokeWeight(1);
		line(col, 0, col, height);
	}
	pieDiv = createDiv('0.0');
	pieDiv.style('font-size', '64pt');
	pieDiv.style('font-family', 'courier');
}

function draw() {
	for (let i = 0; i < 10; i++) {
		const angle = random(-PI / 2, PI / 2);
		const x = random(width);
		const y = random(height);

		const closest = round(x / t);
		const d = abs(closest * t - x);

		if (d < (len * sin(angle)) / 2) {
			stroke(0, 255, 0);
			strokeWeight(2);
			intersecting++;
		} else {
			stroke(255, 100);
			strokeWeight(2);
		}

		total++;

		push();
		translate(x, y);
		rotate(angle);
		strokeWeight(1);
		line(0, -len / 2, 0, len / 2);
		pop();
	}

	let prob = intersecting / total;
	let pie = (2 * len) / (prob * t);
	// console.log(pie);

	pieDiv.html(nf(pie, 1, 5));
}
