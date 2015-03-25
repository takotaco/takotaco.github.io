$(document).ready(function() {
	debugger;
	$('#addBox').hide();
	$('#editTitle').hide();
	$('#editBoxTitle').hide();
	$('#boxInfo').hide();
	$('#tutorialPanel').hide();
	$('#redirectScreen').hide();
});

$(window).load(function() {

	//other vars
	var canvas, ctx;
	var chart;
	var boxId = 0;
	var arrowId = 0;
	var startBox = null;
	var startX = 0;
	var startY = 0;
	var endBox = null;
	var endX = 0;
	var endY = 0;
	var selectedBox = null;
	var selectedArrow = null;
	var clickedArrow = null;
	var movingBox = false;
	var drawingArrow = false;
	var mouseOverBox = false;

	//tutorial shit
	var tutorial = false;
	var steps = ["name chart", "add box", "add another box", "move box", "make an arrow", "select box", "add info to box", "done"];
	var step = 0;

	$('#tutLink').click(function () {
		tutorial = true;
		$('#tutorialPanel').show();
		for (var i=1; i < steps.length; i++) {
			$('#step' + i).hide();
		}
		$('#splash').hide();
		$('#prevStep').hide();
	});

	$('#nextStep').click(function () {
		nextTutStep();
	});

	var nextTutStep = function () {
		$('#step' + step).hide();
		step ++;
		if (step == steps.length) {
			tutorial = false;
			step = 0;
			$('#tutorialPanel').hide();
			$('#nextStep').html('next');
			showSelectedBoxInfo();
		}
		$('#step' + step).fadeToggle();
		if (step > 0) {
			$('#prevStep').show();
		}
		if (step == steps.length - 1) {
			$('#nextStep').html('done');
		}
	};

	$('#prevStep').click(function () {
		prevTutStep();
	});

	var prevTutStep = function () {
		$('#step' + step).hide();
		step --;
		$('#step' + step).fadeToggle();
		if (step < steps.length - 1) {
			$('#nextStep').html('next');
		}
		if (step == 0) {
			$('#prevStep').hide();
		}
	}

	canvas = document.getElementById('chartEditor');
	ctx = canvas.getContext('2d');

	chart = new Chart(null, "", "");

    $('#cancelAddBox').click(function() {
    	$('#boxText').val('');
    	$('#addBox').hide();
    });

    $(canvas).dblclick(function(evt) {
    	clearSelection();	

    	if (clickedArrow != null) {
    		deselectSelectedBox();
    		chart.deselectBoxes();
    		showSelectedBoxInfo();
    		$('#addBox').hide();
    		if (selectedArrow != null) {
    			selectedArrow.selected = false;
	    		clickedArrow.selected = true;
	    		selectedArrow = clickedArrow;
	    		redraw();
    		} else {
    			clickedArrow.selected = true;
	    		selectedArrow = clickedArrow;
	    		redraw();
    		}
    		return;
    	}

    	if (startBox != null && endBox != null && startBox == endBox) {
    		if (selectedArrow != null) {
    			selectedArrow.selected = false;
    			selectedArrow = null;
    		}
    		if (startBox.selected == true) {
    			deselectSelectedBox();
    			chart.deselectBoxes();
    			redraw();
    		} else {
	    		chart.deselectBoxes();
	    		redraw();
	    		startBox.selected = true;
	    		selectedBox = startBox;
	    		redraw();
	    	}
    	}
    	showSelectedBoxInfo();
    	$('#addBox').hide();
    });

    $(canvas).mousedown(function(evt) {
    	clearSelection();
        var offset = $('#chartEditor').offset();
		var x = evt.pageX - offset.left;
		var y = evt.pageY - offset.top;

		startX = x;
		startY = y;

		startBox = getBoxByCoordinates(chart.boxList, x, y);

		if (inBoxMove(startBox, x, y)) {
			movingBox = true;
			animateMovingBox();
		} else if (startBox != null) {
			drawingArrow = true;
		}

    }).mouseup(function(evt) {
    	clearSelection();
        var offset = $('#chartEditor').offset();
		var x = evt.pageX - offset.left;
		var y = evt.pageY - offset.top;

		endX = x;
		endY = y;

		endBox = getBoxByCoordinates(chart.boxList, x, y);
		clickedArrow = getArrowByCoordinates(chart.arrowList, x, y);

		if (endBox != null && startBox != null && startBox != endBox) {
			addNewArrowToCanvas();
			$('#addBox').hide();
		}

		if (movingBox == true) {
			movingBox = false;
			$('#addBox').hide();
			if (tutorial == true && steps[step] == 'move box') {
				nextTutStep();
			}
		}

		if (drawingArrow == true) {
			drawingArrow = false;
			redraw();
			if (tutorial == true && steps[step] == 'make an arrow') {
				nextTutStep();
			}
		}

		if (clickedArrow != null) {
			return;
		}

		if (endBox == null && startBox == null) {
			deselectSelectedBox();
			chart.deselectBoxes();
			showSelectedBoxInfo();
    		redraw();
			addBoxPopup(evt);
		}


		//if endBox, don't make new box
		//if no endBox and start location = end location, we just clicked and want to make a new box
		//if endBox == startBox don't draw an arrow! Because it will just point to same box
		//in this case actually want to bring up detailed infor for that box so can add/edit

    });

	$(canvas).mousemove(function(evt) {
		var offset = $('#chartEditor').offset();
		var x = evt.pageX - offset.left;
		var y = evt.pageY - offset.top;
		if (movingBox == true) {
			endX = x;
			endY = y;
			moveBox();
			startX = x;
			startY = y; 
		} else if (drawingArrow == true) {
			var fakeBox = new Box(x, y, "", -1, []);
			var ghostArrow = new Arrow(startBox, fakeBox, -1, "");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			redraw();
			drawArrow(ghostArrow, ctx);
		} else {
			var inBox = getBoxByCoordinates(chart.boxList, x, y);
			if (inBox != null) {
				mouseOverBox = true;
				redraw();
				drawMoveAnchor(ctx, inBox.left, inBox.top, inBox.selected);
			}
			else {
				if (mouseOverBox == true) {
					mouseOverBox = false;
					redraw();
				}	
			}
		}
	});

    var addBoxPopup = function(evt) {

		//move this to the mousedown/mouseup stuff
		var x = evt.pageX;
		var y = evt.pageY;

    	$('#addBox').css('position', 'absolute');
    	$('#addBox').css('z-index', 1);
    	$('#addBox').css('top', y);
    	$('#addBox').css('left', x);
    	$('#addBox').show();
    	$('#boxText').attr('tabindex','0');
    	$('#boxText').focus();
    };

	var addNewBoxToCanvas = function () {
		var text = $('#boxText').val();
		var x = $('#addBox').css('left');
		var y = $('#addBox').css('top');
		x = x.substring(0, x.length - 2);
		y = y.substring(0, y.length - 2);
		x = parseInt(x);
		y = parseInt(y);

		var offset = $('#chartEditor').offset();

		var newBox = new Box(x - offset.left, y - offset.top, text, boxId, []);
		newBox.selected = true;
		selectedBox = newBox;
		showSelectedBoxInfo();
		boxId++;

		if (selectedArrow != null) {
			selectedArrow.selected = false;
			selectedArrow = null;
		}

		//want to actually fill in boxes too so that they aren't transparent
		chart.addBox(newBox);		
		$('#boxText').val('');
		$('#addBox').hide();

		redraw();

		if (tutorial == true && (steps[step] == 'add box' || steps[step] == 'add another box')) {
			nextTutStep();
		}
	};

	var showSelectedBoxInfo = function() {
		if (selectedBox != null) {
			boxDetails = selectedBox.details;
			$('#detailsInput').val(boxDetails);
			boxRefs = selectedBox.references;
			$('#referencesInput').val(boxRefs);
			boxText = selectedBox.text;
			$('#boxTitleText').html(boxText);
			$('#boxInfo').show();
			$('#splash').hide();
			if (tutorial == true && steps[step] == 'select box') {
				nextTutStep();
			}
		}
		else {
			$('#boxInfo').hide();
			$('#splash').show();
		}
	};

	var deselectSelectedBox = function() {
		if (selectedBox != null) {
			selectedBox.details = $('#detailsInput').val();
			$('#detailsInput').val('');
			selectedBox.references = $('#referencesInput').val();
			$('#referencesInput').val('');
			selectedBox.text = $('#boxTitleText').html();
			$('#boxTitleText').html('');
			$('#boxTitleInput').val('');
			selectedBox = null;
		}
	};

	var moveBox = function() {
		var offset = $('#chartEditor').offset();
		var diffX = endX - startX;
		var diffY = endY - startY;
		startBox.left += diffX;
		startBox.top += diffY;
		redraw();
	};

	var redraw = function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		chart.draw(ctx);
	};

	var addNewArrowToCanvas = function () {
		var parent = startBox;
		var child = endBox;
		if (parent != null && child != null) {
			var newArrow = new Arrow(parent, child, arrowId, '');
			arrowId++;
			chart.addArrow(newArrow);
			redraw();
		}
	};

	$('#addBoxButton').click(function () {
		addNewBoxToCanvas();
	});

	$('#deleteBoxButton').click(function () {
		chart.delBox(selectedBox.id);
		selectedBox = null;
		showSelectedBoxInfo();
		redraw();
	});

	$('#saveBoxButton').click(function () {
		deselectSelectedBox();
		chart.deselectBoxes();
		showSelectedBoxInfo();
		redraw();

		if (tutorial == true && steps[step] == 'add info to box') {
			nextTutStep();
		}
	});

	var updateTitle = function () {
		var newTitle = $('#titleInput').val();
		chart.title = newTitle;
		$('#titleText').html(newTitle);
		$('#titleInput').val(newTitle);
		$('#editTitle').hide();
		$('#viewTitle').show();
		if (tutorial == true && steps[step] == 'name chart') {
			nextTutStep();
		}
	};

	var updateBoxTitle = function () {
		var newText = $('#boxTitleInput').val();
		selectedBox.text = newText;
		$('#boxTitleText').html(newText);
		$('#boxTitleInput').val(newText);
		$('#editBoxTitle').hide();
		$('#boxTitleText').show();
	};

	$('#boxText').keydown(function () {
		if (event.keyCode === 13) {
			addNewBoxToCanvas();
		}
		if (event.keyCode === 27) {
			$('#boxText').val('');
			$('#addBox').hide();
		}
	});

	$('#updateTitle').click(function () {
		updateTitle();
	});

	$('#updateBoxTitle').click(function () {
		updateBoxTitle();
	});

	$('#titleInput').keydown(function () {
		if (event.keyCode === 13) {
			updateTitle();
		}
	});

	$('#boxTitleInput').keydown(function () {
		if (event.keyCode === 13) {
			updateTitle();
		}
	});

	$(document).keydown(function () {
		if (event.keyCode === 189) {
			if (selectedBox != null) {
				chart.delBox(selectedBox.id);
				selectedBox = null;
				showSelectedBoxInfo();
				redraw();
			}
			if (selectedArrow != null) {
				chart.delArrow(selectedArrow.id);
				selectedArrow = null;
				redraw();
			}
		}
	});

	$('#editTitleButton').click(function () {
		$('#viewTitle').hide();
		$('#editTitle').show();
		$('#titleInput').attr('tabindex','0');
		$('#titleInput').focus();
	});

	$('#editBoxTitleButton').click(function () {
		$('#boxTitleText').hide();
		$('#editBoxTitle').show();
		$('#boxTitleInput').attr('tabindex','0');
		$('#boxTitleInput').focus();
	});

	$('#saveChart').click(function() {

		deselectSelectedBox();

		$('input:checked').each(function () {
			chart.tags.push($(this).attr('id'));
		})

		$('#redirectScreen').show();

		var name = $('#authorInput').val();
		chart.author = name;
		jsonToServer = chartToJSON(chart);
		var boo = $.post("/submit_chart",  { json_chart : jsonToServer }, function (data, success) { 
			$('body').html(data);
		});
	});

	function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    };
}

});
