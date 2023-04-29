'use strict';

let data;
let months;
let currentRow = 1;
let currentMonth = 0;
let previousAnomaly = 0;

const zeroRadius = 125;
const oneRadius = 200;

function preload() {
	data = loadTable('./giss-data-apr-29-2023.csv', 'csv', 'header');
}

function setup() {
	createCanvas(600, 600);
	months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
}

function draw() {
	background(0);
	translate(width / 2, height / 2);
	textAlign(CENTER, CENTER);
	textSize(16);

	stroke(255);
	strokeWeight(2);
	noFill();
	circle(0, 0, zeroRadius * 2);
	fill(255);
	noStroke();
	text('0°', zeroRadius + 10, 0);

	stroke(255);
	strokeWeight(2);
	noFill();
	circle(0, 0, oneRadius * 2);
	fill(255);
	noStroke();
	text('1°', oneRadius + 10, 0);

	stroke(255);
	strokeWeight(2);
	noFill();
	circle(0, 0, 500);

	for (let i = 0; i < months.length; i++) {
		noStroke();
		fill(255);
		textSize(20);
		const angle = map(i, 0, months.length, 0, TWO_PI);
		push();
		const x = 264 * cos(angle);
		const y = 264 * sin(angle);
		translate(x, y);
		rotate(angle + PI / 2);
		text(months[i], 0, 0);
		pop();
	}

	const year = data.getRow(currentRow).get('Year');
	textSize(20);
	text(year, 0, 0);

	noFill();
	stroke(255);
	let firstValue = true;
	for (let j = 0; j < currentRow; j++) {
		const row = data.getRow(j);

		let totalMonths = months.length;
		if (j == currentRow - 1) {
			totalMonths = currentMonth;
		}

		for (let i = 0; i < totalMonths; i++) {
			let anomaly = row.get(months[i]);
			if (anomaly !== '***') {
				anomaly = parseFloat(anomaly);
				const angle = map(i, 0, months.length, 0, TWO_PI) - PI / 3;
				const pr = map(previousAnomaly, 0, 1, zeroRadius, oneRadius);
				const r = map(anomaly, 0, 1, zeroRadius, oneRadius);

				const x1 = r * cos(angle);
				const y1 = r * sin(angle);
				const x2 = pr * cos(angle - PI / 6);
				const y2 = pr * sin(angle - PI / 6);

				if (!firstValue) {
					const avg = (anomaly + previousAnomaly) * 0.5;
					const cold = color(0, 0, 255);
					const warm = color(255, 0, 0);
					const zero = color(255);
					let lineColor = zero;
					if (avg < 0) {
						lineColor = lerpColor(zero, cold, abs(avg));
					} else {
						lineColor = lerpColor(zero, warm, abs(avg));
					}

					stroke(lineColor);
					line(x1, y1, x2, y2);
				}
				firstValue = false;
				previousAnomaly = anomaly;
			}
		}
	}

	currentMonth += 1;
	if (currentMonth === months.length) {
		currentMonth = 0;
		currentRow += 1;
		if (currentRow === data.getRowCount()) {
			noLoop();
		}
	}
}
