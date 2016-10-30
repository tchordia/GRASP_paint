var storage = firebase.storage();
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.strokeStyle = "red";

var filename = location.search.replace(/^.*?\=/, '');
filename = parseInt(filename);
var cur = 1;
var url ='https://grasp-window-img.s3.amazonaws.com/Window_cropped_numbered/grasp_window_img_' + filename + '.png';

$('#canvas').css('background','url('+ url + ')'); 

var beginX;
var beginY;
var sideX;
var sideY;
var select;
var currentColor; 
var data = {"rect":[]}

canvas.addEventListener('mousedown', function(evt) {
        console.log("click!");
        var mousePos = getMousePos(canvas, evt);
        select = 1;
        beginX = mousePos.x;
        beginY = mousePos.y;
}, false);

canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        if (select) {
            sideX = mousePos.x-beginX;
            sideY = mousePos.y-beginY;
            drawRect(beginX, beginY, sideX, sideY);
        }
}, false);
      
canvas.addEventListener('mouseup', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        select = 0;
        context.drawImage(canvas,0,0);
        data.rect.push({"beginx":beginX, "beginy":beginY, "sidex":sideX, "sidey":sideY, "color":currentColor});   
}, false);
      
function clearCanvas() {  
    context.clearRect(0, 0, canvas.width, canvas.height);
    //location.reload();
}

function getMousePos(canvas, evt) {
    if (evt.pageX != undefined && evt.pageY != undefined) {
        var x = evt.pageX;
		var y = evt.pageY;
	}
	else {
	    x = evt.clientX + document.body.scrollLeft +
				document.documentElement.scrollLeft;
		y = evt.clientY + document.body.scrollTop +
				document.documentElement.scrollTop;
    }

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
    return {
        x: x,
        y: y
    };
}


function drawRect(x1, y1, x2, y2) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(currentColor)
        context.fillRect(x1, y1, x2, y2);
    else
        context.strokeRect(x1, y1, x2, y2);    
}

var callback = function () {
  console.log("incallback")
  filename = filename + 1;
  cur = cur + 1;
  clearCanvas();
  if (cur < 6) {
    var url ='https://grasp-window-img.s3.amazonaws.com/Window_cropped_numbered/grasp_window_img_' + filename + '.png';
    $('#canvas').css('background','url('+ url + ')'); 
    $('#counter').html(cur);
  } else {
    console.log(window.location.pathname + 'thanks');
    window.location.replace('/thanks');
  }
}
  
$('#success').click(function onclick() {
 
 console.log('click: post to ' +  window.location.pathname); 
  var data = {
    win:1,
    filename:filename,
    x1: beginX,
    y1: beginY,
    x2: sideX,
    y2: sideY
  }
  $.post(window.location.pathname, data, callback);
  
});

$('#nowindow').click(function onclick() {
 
 console.log('click: post to ' +  window.location.pathname); 
  var data = {
    win:0,
    filename:filename,
  }
  $.post(window.location.pathname, data, callback);  
});
