// https://editor.p5js.org/kevinvennitti/sketches/b3OyRruGF

let dotSize = 40;
let grid = 40;
let offset = 0;

let globalX = 0;
let globalY = 5;

let sinTime = 0;


function setup() {
  createCanvas(600, 600);
  background(50);
  noStroke();
  noFill();
}

function draw() {
 // fill(50, 50, 50, 1);
 // rect(0,0,width,height);
  
  colorMode(HSB, 360, 100, 100);
  let dotColor = map(sin(sinTime), -1, 1, 00, 360);
  
  fill(dotColor, 80, 80,1);
  colorMode(RGB, 255, 255, 255);
  
  for (let x = -50; x <= width; x += grid) {
    for (let y = -50; y <= height; y += grid) {
      offset = random(80);
      
      ellipse(x+globalX+offset, y+globalY+offset, dotSize, dotSize);   
    }
  }
  
  globalX += 0;
  globalY += 2;
  
  sinTime += .002;
}

function keyPressed() {
  if (key == "a") {
    save('cc.png');
  }
}