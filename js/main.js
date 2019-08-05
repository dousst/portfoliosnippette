//GET REFERENCE TO CANVAS
var canvas = document.getElementById('canvas');

//GET REFERENCE TO CANVAS CONTEXT
var context = canvas.getContext('2d');

//GET REFERENCE TO LOADING VIEW
var loading_page = document.getElementById('loading');

//Initialize a loading variables
var loaded = false;
var load_counter = 0;

//Initialize image object for each layer
var background = new Image();
var clouds = new Image();
var arrows = new Image();
var designs = new Image();
var shadow = new Image();
var person = new Image();
var circles = new Image();

//Create a list of layer objects
var layer_list = [
 {
    'image': background,
    'src': './images/para/bg-01.png',
    'z_index': -2.25,
    'position':{x:0, y:0},
    'blend': null,

    'opacity':1 
 },
 {
    'image': clouds,
    'src': './images/para/clouds-01.png',
    'z_index': -2.20,
    'position' : {x: 0, y:0},
    'blend': null,
    'opacity' : 1 
 },
 {
    'image': arrows,
    'src': './images/para/arrows-01.png',
    'z_index': 0,
    'position' : {x: 0, y:0},
    'blend': null,
    'opacity' : 1 
 },
 {
    'image': designs,
    'src': './images/para/designs-01.png',
    'z_index': -0.5,
    'position' : {x: 0, y:0},
    'blend': null,
    'opacity' : 1 
 },
 {
    'image': shadow,
    'src': './images/para/shadow.png',
    'z_index': -2.10,
    'position' : {x: 0, y:0},
    'blend': null,
    'opacity' : 0.75 
 },
 {
    'image': person,
    'src': './images/para/designer-01.png',
    'z_index': -2.15,
    'position' : {x: 0, y:0},
    'blend': null,
    'opacity' : 1 
 },
 {
    'image': circles,
    'src': './images/para/circles-01.png',
    'z_index': 2,
    'position' : {x: 0, y:0},
    'blend': null,
    'opacity' : 0.88 
 }
];

layer_list.forEach(function(layer, index) {
    layer.image.onload = function() {
        load_counter += 1;
        if (load_counter >= layer_list.length){
            hideLoading(); //hide the loading screen
            requestAnimationFrame(drawCanvas);
        }
    }
    layer.image.src = layer.src;
});

function hideLoading(){
    loading_page.classList.add('hidden');
}

function drawCanvas() {
    //Clear what's in the canvas at the moment 
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Update the tween
    TWEEN.update();

    //calculate how much the canvas should rotate
    var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
    var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);

    var transform_string = "rotateX(" + rotate_x + "deg) rotateY(" +rotate_y + "deg)";

    //Rotate the canvas
    canvas.style.transform = transform_string;

    //loop through each layer and draw it to the canvas
    layer_list.forEach(function(layer, index) {

        layer.position = getOffset(layer);

        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else{
            context.globalCompositeOperation = 'normal';
        }
        context.globalAlpha = layer.opacity;

        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });
    requestAnimationFrame(drawCanvas);
}

//Get Offset function
function getOffset(layer){
    var touch_multiplier = 0.3;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

    var motion_multiplier = 2.5;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;

    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };
    return offset;
}

///Touch and Mouse Controls ///

var moving = false;

//Initialize touch and mouse position
var pointer_initial = {
    x: 0,
    y: 0
};

var pointer = {
    x: 0,
    y: 0
} 

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event){
    moving = true;
    
    //touch or mose event?
    if (event.type === 'touchstart') {
        //alert('Use your hand or device to move the image ');
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    }else if (event.type === 'mousedown') {
        //alert('Use your mouse to move the image');
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}

//Find where the touch point is
window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event){
    event.preventDefault();
    if (moving ===true){
        var current_x = 0;
        var current_y = 0;

        if (event.type === 'touchmove'){
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        }else if (event.type === 'mousemove'){
            current_x = event.clientX;
            current_y = event.clientY;
        }
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;
    }
}

canvas.addEventListener('touchmove', function(event){
    event.preventDefault();
});

canvas.addEventListener('movemove', function(event){
    event.preventDefault();

});

//Return image to default position 
window.addEventListener('touchend', function(event){
    endGesture();
});
window.addEventListener('mouseup', function(event){
    endGesture();
});

function endGesture(){
    moving = false;

    //pointer.x = 0;
    //pointer.y = 0;

    TWEEN.removeAll();
    var pointer_tween = new TWEEN.Tween(pointer).to({x:0, y:0},300).easing(TWEEN.Easing.Back.Out).start();
}

//MOTION CONTROLS////

//Initialise 
var initial_motion = {
    x: null,
    y: null
};

var motion = {
    x: 0,
    y: 0
};

//Listen to gyroscope events
window.addEventListener('deviceorientation', function(event){
    //find the device's angle 
    if(!initial_motion.x && !initial_motion.y){
        initial_motion.x = event.beta;
        initial_motion.y = event.gamma;
    }
        if (this.window.orientation ===0){
            //The device is in portrait orientation
            motion.x = event.gamma - initial_motion.y;
            motion.y = event.beta - initial_motion.x;

        }else if (this.window.orientation === 90){
            //The device is in landscae on the left side
            motion.x = event.beta - initial_motion.x;
            motion.y = event.gamma + initial_motion.y;

        }else if (this.window.orientation === -90){
            //The device is in landscape on the right side
            motion.x = event.beta + initial_motion.x;
            motion.y = event.gamma - initial_motion.y;
        }else {
             //The device is upside down
             motion.x = event.gamma + initial_motion.y;
             motion.y = event.beta + initial_motion.x;

        }

});

window.addEventListener('orientationchange', function(event){
    initial_motion.x = 0;
    initial_motion.y = 0;
});