'use strict';

class Step {
	constructor(dx, dy) {
		this.dx = dx;
		this.dy = dy;
		this.tried = false;
	}
}

function _allOptions() {
	return [new Step(1, 0), new Step(-1, 0), new Step(0, 1), new Step(0, -1)];
}

class Spot {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.x = i * spacing;
		this.y = j * spacing;
		this.options = _allOptions();
		this.visited = false;
	}

	clear() {
		this.visited = false;
		this.options = _allOptions();
	}

	nextSpot() {
		const validOptions = [];
		for (const option of this.options) {
			const newX = this.i + option.dx;
			const newY = this.j + option.dy;
			if (isValid(newX, newY) && !option.tried) {
				validOptions.push(option);
			}
		}
		if (validOptions.length > 0) {
			const step = random(validOptions);
			step.tried = true;
			return grid[this.i + step.dx][this.j + step.dy];
		}
		return undefined;
	}
}
