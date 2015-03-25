//contains all functions for drawing/displaying the chart itself, as well as page content

window.onload = function() {
};

var timerDelay = 100;

var redrawAll = function (canvas, context, chart) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    chart.draw(context);
}

var drawBox = function (box, context) {
    //(x1, y1) refers to the top left corner,
    //(x2, y2) refers to the bottom right corner
    var x1 = box.left;
    var y1 = box.top;
    //var textWidth = context.measureText(box.text).width;
    var maxWidth = 100;
    context.font="12px Arial"
    var lineHeight = 14;

    if (box.width == null) {
        box.width = maxWidth/2 + 10;
    }
    if (box.height == null) {
        box.height = 10;
    }
    //var y2 = y1 + box.height;

    //draw white bg for box
    var fill = true;
    drawBoxShape(context, x1, y1, x1 + box.width, y1 + box.height + 12, box.selected, fill);

    //draw text in box
    //context.fillText(box.text, x1 + textWidth + 5, y1 + textHeight/2 + 5);

    wrapTextPlusBox(context, box, x1, y1, maxWidth, lineHeight);

    //drawBoxShape(context, x1, y1, x2, y2, box.selected);
}

var wrapTextPlusBox = function (context, box, x, y, maxWidth, lineHeight) {

    var text = box.text;

    if (text != null) {
        var words = text.split(' ');
    } else {
        var words = [];
    }
    var line = '';

    var y1 = y;
    var x1 = x;

    y += 5;
    //x += 5;

    var maxLineWidth = 0;

    context.textAlign = "left";
    context.textBaseline = "top";
    context.lineWidth = 1;
    context.fillStyle = 'black';

    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var testLineWidth = context.measureText(testLine).width;
        if (testLineWidth > maxWidth && i >= 1) {
            context.fillText(line, x, y);
            lineWidth = context.measureText(line).width;
            if (lineWidth > maxLineWidth) {
                maxLineWidth = lineWidth;
            }
            line = words[i] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    lineWidth = context.measureText(line).width;
    if (lineWidth > maxLineWidth) {
        maxLineWidth = lineWidth;
    }

    var y2 = y;
    box.height = y2 - y1;

    box.width = maxLineWidth;

    drawBoxShape(context, x1, y1, x1 + box.width, y1 + box.height + 12, box.selected, false);
}

var drawBoxShape = function (context, x1, y1, x2, y2, selected, fill) {

    if (fill == true) {
        context.fillStyle = 'white';
    } else {
        if (selected == true) {
            context.lineWidth = 3;
            context.strokeStyle = 'orange';
        } else {
            context.lineWidth = 1;
            context.strokeStyle = 'black';
        }
    }
 
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y1);
    context.arc(x2,y1+5,5,-Math.PI/2,0,false);
    context.lineTo(x2+5,y2);
    context.arc(x2,y2,5,0,Math.PI/2,false);
    context.lineTo(x1, y2+5);
    context.arc(x1,y2,5,Math.PI/2,Math.PI,false);
    context.lineTo(x1-5, y1+5);
    context.arc(x1,y1+5,5,Math.PI,3*Math.PI/2,false);
    context.closePath();

    if (fill == true) {
        context.fill();
    } else {
        context.stroke();
    }
}

var drawMoveAnchor = function (context, x, y, selected) {

    context.lineWidth = 1;
    context.strokeStyle = 'black';

    if (selected == false) {
        x -= 4;
        y = y;
    } else {
        x -= 4;
        y += 1;
    }

    context.beginPath();
    context.moveTo(x, y + 3);
    context.lineTo(x + 3, y);
    context.moveTo(x, y + 7);
    context.lineTo(x + 7, y);
    context.closePath();
    context.stroke();
}

var drawArrow = function (arrow, context) {
    var pl = arrow.parent.left;
    var pt = arrow.parent.top;
    var pw = arrow.parent.width;
    var ph = arrow.parent.height;
    var cl = arrow.child.left;
    var ct = arrow.child.top;
    var cw = arrow.child.width;
    var ch = arrow.child.height;


    var startx;
    var starty;
    var endx;
    var endy;

    //child is above parent
    if ((ct + ch) <= pt) {
        startx = pl + pw/2;
        starty = pt;
        endx = cl + cw/2;
        endy = ct + ch + 17;
    }
    //side by side
    //need to fix y placement of arrows to some extent, not quite centered...
    else if ((((ct + ch) >= pt) && ((ct + ch) <= (pt + ph))) || 
            (((pt + ph) >= ct) && ((pt + ph) <= (ct + ch)))) {
        //child is right of parent
        if (cl >= pl + pw) {
            startx = pl + pw + 5;
            starty = pt + ph/2 + 8;
            endx = cl - 5;
            endy = ct + ch/2 + 8;
        }
        //child is to left of parent
        else {
            startx = pl - 5;
            starty = pt + ph/2 + 8;
            endx = cl + cw + 5;
            endy = ct + ch/2 + 8;
        }
    }
    //child is below parent
    //if (ct > (pt + ph))
    else {
        startx = pl + pw/2;
        starty = pt + ph + 17;
        endx = cl + cw/2;
        endy = ct;
    }

    arrow.startx = startx;
    arrow.starty = starty;
    arrow.endx = endx;
    arrow.endy = endy;

    var headlength = 7;
    var angle = Math.atan2(endy - starty, endx - startx);

    var headx1 = endx - headlength*Math.cos(angle - Math.PI/4);
    var heady1 = endy - headlength*Math.sin(angle - Math.PI/4);
    var headx2 = endx - headlength*Math.cos(angle + Math.PI/4);
    var heady2 = endy - headlength*Math.sin(angle + Math.PI/4);

    if (arrow.selected == true) {
        context.lineWidth = 3;
        context.strokeStyle = 'orange';
    } else {
        context.lineWidth = 1;
        context.strokeStyle = 'black';
    }

    context.beginPath();
    context.moveTo(startx,starty);
    context.lineTo(endx,endy);
    context.lineTo(headx1, heady1);
    context.moveTo(endx,endy);
    context.lineTo(headx2, heady2);
    context.stroke();
};

var drawChart = function (chart, context) {
    var i = 0;
    var j = 0;
    for (i; i < chart.boxList.length; i++) {
        chart.boxList[i].draw(context);
        for (j; j < chart.boxList[i].childArrows.length; j++) {
            chart.boxList[i].childArrows[j].draw(context);
        }
        j = 0;
    }
};
