//model for the charts, these functions are used to create them

//may need to rethink this stuff for easy creation/updating
function Chart(id, title, author) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.tags = []; //added later
	this.boxList = []; //added later
	this.arrowList = [];
	this.comments = [];
	this.rating = 2.5; //added later
	this.draw = function (context) {drawChart(this, context)};
	this.addBox = function (newBox) {addBox(this, newBox)};
	this.addArrow = function (arrow) {addArrow(this, arrow)};
	this.getBoxByCoordinates = function (x, y) {getBoxByCoordinates(this.boxList, x, y)};
	this.getArrowByCoordinates = function (x, y) {getArrowByCoordinates(this.arrowList, x, y)};
	//this.getBoxById = function (id) {getBoxByIdFromList(this.boxList, id)};
	this.delBox = function (boxId) {delBox(this, boxId)};
	this.delArrow = function (arrowId) {delArrow(this, arrowId)};
	this.deselectBoxes = function () {deselectBoxes(this.boxList)};
	this.deselectArrows = function () {deselectArrows(this.arrowList)};
};

function Box(x, y, text, id, arrows) {
	this.id = id;
	this.text = text;
	this.details = '';
	this.references = '';
	//positioning
	//height and width set when actually drawing it so we can get real height and width of text
	this.height = null; //actually want to get height of real text, or just leave height out and just draw in canvas but have to deal with arrows
	this.width = null; 
	this.top = y;
	this.left = x;
	this.childArrows = arrows;
	this.selected = false;
	this.draw = function (context) {drawBox(this, context)};
	this.inBox = function (x, y) {inBox(this, x, y)};
};

function Arrow(startBox, endBox, id, text) {
	this.id = id;
	this.text = text;
	//need these to know when to add the arrow to the box's link list
	this.parent = startBox;
	this.child = endBox;
	this.draw = function (context) {drawArrow(this, context)};
	this.selected = false;
	this.startx = null;
	this.starty = null;
	this.endx = null;
	this.endy = null;
};


//update functions, takes a chart object and updates it
function updateTitle(chart, newTitle) {
	chart.title = newTitle;
}

//add a box
function addBox(chart, newBox) {
	chart.boxList.push(newBox);
}

//add an arrow
function addArrow(chart, arrow) {
	//push the arrow onto the link list of the parent
	arrow.parent.childArrows.push(arrow);
	chart.arrowList.push(arrow);
}

//remove a box
//make sure to remove all arrows to and from box
function delBox(chart, boxId) {
	var index = getBoxIndex(chart.boxList, boxId);
	chart.boxList.splice(index, 1);
	var arrowsToDelete = [];
	for (var i = 0; i < chart.arrowList.length; i++) {
		if (chart.arrowList[i].parent.id == boxId || chart.arrowList[i].child.id == boxId) {
			arrowsToDelete.push(chart.arrowList[i].id);
		}
	}
	for (var j = 0; j < arrowsToDelete.length; j++) {
		delArrow(chart, arrowsToDelete[j]);
	}
}

//remove an arrow
	//can remove arrows individually	
function delArrow(chart, arrowId) {
	var index = getArrowIndex(chart.arrowList, arrowId);
	var boxIndex = getArrowIndexInBox(chart.arrowList[index].parent.childArrows, arrowId);
	chart.arrowList[index].parent.childArrows.splice(boxIndex, 1);
	chart.arrowList.splice(index, 1);
}

function deselectBoxes(boxList) {
	for (var i = 0; i < boxList.length; i++) {
		boxList[i].selected = false;
	}
}

function deselectArrows(arrowList) {
	for (var i = 0; i < arrowList.length; i++) {
		arrowList[i].selected = false;
	}
}

//a few control stuff from editing/making a new chart
//need to get chart id/object for each page so we can do this properly
/*$('#updateTitle').onclick = function (chart) {
	var newTitle = $('#textarea#titleInput').val();
	updateTitle(chart, newTitle);
};*/

var getArrowIndex = function(arrowList, id) {
	var i = 0;
	for (i; i < arrowList.length; i++) {
		if (arrowList[i].id === id)
			return i;
	}
};

var getArrowIndexInBox = function(boxArrowList, id) {
	var i = 0;
	for (i; i < boxArrowList.length; i++) {
		if (boxArrowList[i].id === id)
			return i;
	}
};

var getBoxIndex = function(boxList, id) {
	var i = 0;
	for (i; i < boxList.length; i++) {
		if (boxList[i].id === id)
			return i;
	}
};

var getBoxByCoordinates = function(boxList, x, y) {
	var i = 0;
	for (i; i < boxList.length; i++) {
		var found = inBox(boxList[i], x, y);
		if (found === true) {
			return boxList[i];
		}
	}
	return null;
};

function inBox(box, x, y) {
	if ((x > (box.left - 5)) && (x < (box.left + box.width + 5))
		&& (y > (box.top - 5)) && (y < (box.top + box.height + 17))) {
		return true;
	}
	return false;
};

function inBoxMove(box, x, y) {
	if (box === null) {
		return false;
	}
	if ((x > (box.left - 5)) && (x < (box.left + 10))
		&& (y > (box.top - 5)) && (y < (box.top + 10))) {
		return true;
	}
	return false;
};

function getArrowByCoordinates(arrowList, x, y) {
	var i = 0;
	for (i; i < arrowList.length; i++) {
		var found = inArrow(arrowList[i], x, y);
		if (found === true) {
			return arrowList[i];
		}
	}
	return null;
}

function inArrow(arrow, x, y) {
	var m = (arrow.endy - arrow.starty)/(arrow.endx - arrow.startx);
	var b = arrow.starty - m*arrow.startx;
	var xL = (y-b)/m;
	var yL = m*x + b;

	if ((Math.abs(xL - x) <= 5) || (Math.abs(yL - y) <= 5)) {
		return true;
	}
	return false;
}

var getBoxByIdFromList = function(boxList, id) {
		var i = 0;
		for (i; i < boxList.length; i++) {
			if (boxList[i].id === id)
				return boxList[i];
		}
};

function chartToJSON(chart) {
	var i = 0;
	var j = 0;
	var k = 0;

	//make a json chart object
	jchart = new Object();
	jchart.chart = new Object();
	jchart.comments = [];
	jchart.boxes = [];
	jchart.arrows = [];
	jchart.chart.id = chart.id;
	jchart.chart.title = chart.title;
	jchart.chart.author = chart.author;
	jchart.chart.tags = chart.tags;
	jchart.chart.rating = chart.rating;

	//may need to change later depending on how we actually want 
	//comments structured
	for (i; i < chart.comments.length; i++) {
		jchart.comments.push(chart.comments[i]);
	}

	//boxes and arrows
	for (j; j < chart.boxList.length; j++) {
		var box = chart.boxList[j];
		var jbox = new Object();
		jbox.id = box.id;
		jbox.text = box.text;
		jbox.height = box.height;
		jbox.width = box.width;
		jbox.top = box.top;
		jbox.left = box.left;
		jbox.details = box.details;
		jbox.reference = box.references;
		jchart.boxes.push(jbox);
		k = 0;
		for (k; k < chart.boxList[j].childArrows.length; k++) {
			var arrow = chart.boxList[j].childArrows[k];
			var jarrow = new Object;
			jarrow.id = arrow.id;
			jarrow.text = arrow.text;
			jarrow.child_Box = arrow.child.id;
			jarrow.box_id = arrow.parent.id;
			jchart.arrows.push(jarrow);
		}
	}

	return JSON.stringify(jchart);
};

function chartFromJSON(chartJStr) {
	var i = 0;
	var j = 0;

	var jchart = JSON.parse(chartJStr);

	var newChart = new Chart(jchart.chart.id, jchart.chart.title, jchart.chart.author);
	newChart.rating = jchart.chart.rating;
	newChart.comments = jchart.comments;
	newChart.tags = jchart.chart.tags;
	for (i; i < jchart.boxes.length; i++) {
		var box = jchart.boxes[i];
		newBox = new Box(box.left, box.top, box.text, box.id, []);
		newBox.height = box.height;
		newBox.width = box.width;
		newBox.references = box.reference;
		newBox.details = box.details;
		newChart.addBox(newBox);	
	}
	for (j; j < jchart.arrows.length; j++) {
		var jarrow = jchart.arrows[j];
		var box1 = getBoxByIdFromList(newChart.boxList, jarrow.box_id);
		var box2 = getBoxByIdFromList(newChart.boxList, jarrow.child_Box);
		var arrow = new Arrow(box1, box2, jarrow.id, jarrow.text);
		newChart.addArrow(arrow);
	}

	return newChart;
};
