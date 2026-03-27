const faceText = document.getElementById("face");
let count = 0;
function blink() {
    if (count == 0) faceText.textContent = '-_-';
    else if (Math.random() > 0.5 && count == 2) faceText.textContent = '-_-';
    else faceText.textContent = '^_^';
    count++;
    if (count > 20) count = 0;
}
var blinkInterval = setInterval(blink, 100);

let artwork = document.getElementById("artwork");
let contentContainer = document.getElementById("content-container");

function scaleContent() {
    console.log(artwork.scrollHeight)
    contentContainer.style.height = `${artwork.scrollHeight}px`;
}

const bgText = document.getElementById("bg-text");
// $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`.
// ✪✿◉❂✽✹✸✷✱★✦◍✾✮◎❋❊❉❈❇❆❅❄❃❁❀✺✵✫✭✻✼✴✬✯✳✲✧✩✰○◌✶•..
const ascii_grad = '✪◉✽✸✱✦✾◎❊❈❆❄❁✺✫✻✴✯✲✩○✶.';
const ambient_grad = '....✶✶✶✩✩✯✯✲✯✯✩✩✶✶✶....';
const bg_font_size = 32;

// num of total cells
let num_for_height = Math.ceil(document.documentElement.scrollHeight / bg_font_size);
let num_for_width = Math.ceil(document.documentElement.scrollWidth / bg_font_size);
window.addEventListener("resize", (event)=>{
    updateGridSize();
    scaleContent();
});

function updateGridSize() {
    num_for_height = Math.ceil(document.documentElement.scrollHeight / bg_font_size);
    num_for_width = Math.ceil(document.documentElement.scrollWidth / bg_font_size);
}

let currentCell = {
    x: -1,
    y: -1
};
document.addEventListener('mousemove', function(event) {
    currentCell = {
        x: Math.floor((event.clientX + window.scrollX) / bg_font_size),
        y: Math.floor((event.clientY + window.scrollY) / bg_font_size)
    };
});

var r = document.querySelector(':root');
function updateColor() {
    r.style.setProperty('--accent-color', `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, ${Math.random()})`);
}
//updateColor();


bgText.style.fontSize = `${bg_font_size}px`;
bgText.style.lineHeight = `${bg_font_size}px`;
bgText.style.letterSpacing = `${bg_font_size * 2/5}px`;

const max_grad_id = ascii_grad.length - 1;
let current_grad_id = 0;
let lastFrame = [[]]
let lastAmbientFrame = [[]]
function frame() {
    bgText.textContent = '';
    for (let h=0; h < num_for_height; h++) {
        for (let w=0; w < num_for_width; w++) {
            if (!lastFrame[h]) lastFrame[h] = [];
            if (!lastAmbientFrame[h]) lastAmbientFrame[h] = [];
            if (currentCell.x == w && currentCell.y == h){
                lastFrame[h][w] = 0;
                lastAmbientFrame[h][w] = -1;
                bgText.textContent += ascii_grad[0];
            } else if (lastFrame[h][w] != -1 && lastFrame[h][w] != NaN && lastFrame[h][w] != undefined) {
                if (lastFrame[h][w] >= max_grad_id) {
                    lastFrame[h][w] = -1;
                    bgText.textContent += ' ';
                } else {
                    bgText.textContent += ascii_grad[lastFrame[h][w]];
                    lastFrame[h][w]++;
                }
                lastAmbientFrame[h][w] = -1;
            } else {
                if (Math.random() < 0.0002) {
                    lastAmbientFrame[h][w] = 0;
                    bgText.textContent += ' ';
                } else if (lastAmbientFrame[h][w] != -1 && lastAmbientFrame[h][w] != NaN && lastAmbientFrame[h][w] != undefined) {
                    if (lastAmbientFrame[h][w] > max_grad_id) {
                        lastAmbientFrame[h][w] = -1;
                        bgText.textContent += ' ';
                    } else {
                        bgText.textContent += ambient_grad[lastAmbientFrame[h][w]];
                        lastAmbientFrame[h][w]++;
                    }
                } else {
                    lastAmbientFrame[h][w] = -1;
                    bgText.textContent += ' ';
                }
                lastFrame[h][w] = -1;
            }
        }
        bgText.textContent += '\n';
    }
}

function init() {
    updateGridSize();
    scaleContent();
    setInterval(frame, 1000 / 30);
}
window.addEventListener("load", init);