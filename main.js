const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

//Set the width & height of the canvas to match the viewport dimensions
canvas.width = innerWidth;
canvas.height = innerHeight;

const snakeSpriteSheet = new Image();
snakeSpriteSheet.src = 'images/ascii_8.png';

let cols = 288,
    spriteWidth = snakeSpriteSheet.width / cols,
    spriteHeight = spriteWidth,
    outputSpriteSize = 500;

let totalFrames = 288;
let currentFrame = 0;

var disFromCenterX = 0,
    disFromCenterY = 0,
    xOffset = 0,
    yOffset = 0,
    disFromCenter = 0,
    speed = 7;

const offsetWeight = 10;

window.onmousemove = function(e) {
  disFromCenterX = Math.abs(window.innerWidth/2 - e.pageX);
  if (e.pageX > window.innerWidth/2) {xOffset = disFromCenterX/offsetWeight} else {xOffset = -disFromCenterX/offsetWeight};
  disFromCenterY = Math.abs(window.innerHeight/2 - e.pageY);
  if (e.pageY > window.innerHeight/2) {yOffset = disFromCenterY/offsetWeight} else {yOffset = -disFromCenterY/offsetWeight};
  disFromCenter = Math.sqrt(disFromCenterX * disFromCenterX + disFromCenterY * disFromCenterY);
  speed = disFromCenter / 150 + 1;
}

window.onresize = function(e) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    if (canvas.width < 500) {
        outputSpriteSize = canvas.width - 16;
    }
    else {
        outputSpriteSize = 500;
    }

    destX = outputSpriteSize < canvas.width ? ((canvas.width - outputSpriteSize) / 2) : 0;
    destY = outputSpriteSize < canvas.height ? ((canvas.height - outputSpriteSize) / 2) + 50 : 0;
}

//So the canvas can't be rendered before the image
snakeSpriteSheet.onload = function() {
    spriteWidth = snakeSpriteSheet.width / cols;
    spriteHeight = spriteWidth;
    animate();
}

let srcX = 0;
let srcY = 0;
let destX = outputSpriteSize < canvas.width ? ((canvas.width - outputSpriteSize) / 2) : 0;
let destY = outputSpriteSize < canvas.height ? ((canvas.height - outputSpriteSize) / 2) + 50 : 0;

let framesDrawn = 0;

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear frame
    requestAnimationFrame(animate);

    currentFrame = currentFrame % totalFrames; // get current frame
    srcX = currentFrame * spriteWidth; // update position

    //image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight
    ctx.save();

    // draw color
    ctx.fillStyle = "#842300";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // set composite mode
    ctx.globalCompositeOperation = "destination-in";

    ctx.drawImage(snakeSpriteSheet, srcX, srcY, spriteWidth, spriteHeight, destX + xOffset, destY + yOffset, outputSpriteSize, outputSpriteSize);
    ctx.restore();

    framesDrawn++;
    if(framesDrawn >= speed){
        currentFrame++;
        framesDrawn = 0;
    }
}