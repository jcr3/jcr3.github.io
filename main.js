const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

//Set the width & height of the canvas to match the viewport dimensions
canvas.width = innerWidth;
canvas.height = 500;

const snakeSpriteSheet = new Image();
snakeSpriteSheet.src = 'sprite-sheet.png';

let cols = 288;

//Work out the size of individual sprites because they are evenly spaced apart
const spriteWidth = snakeSpriteSheet.width / cols;
const spriteHeight = spriteWidth;

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
  console.log(speed);
}

//So the canvas can't be rendered before the image
snakeSpriteSheet.onload = function() {
    animate();
}

let srcX = 0;
let srcY = 0;
let destX = canvas.height < canvas.width ? ((canvas.width - canvas.height) / 2) : 0;

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

    ctx.drawImage(snakeSpriteSheet, srcX, srcY, spriteWidth, spriteHeight, destX + xOffset, yOffset, canvas.height, canvas.height);
    ctx.restore();

    framesDrawn++;
    if(framesDrawn >= speed){
        currentFrame++;
        framesDrawn = 0;
    }
}