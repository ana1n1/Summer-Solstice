let size; // Canvas width
let img_front, img_back; // Image
let numVertex = 20; // SEED NUMBER
let vertexMin = 12; // Seed Min limit
let vertexMax = 99; // Seed Max limit
let interactStep = 3; // Step increase/decrease Seed
let density;
let pauseChange = 50;
let gemsVertex = [];
let vertexXY = [];
let centerVect;
let saveNum = 0;
let scaleFactor = 2;

function preload() {
  /*
  Photo Credit: Ranadeep Bania
  https://unsplash.com/@xaponxagar
  https://www.instagram.com/xapon_xagar/
  https://unsplash.com/photos/j-3JPJBLmUE
  Free to use under the Unsplash License
  */
  img_front = loadImage(
    "./assets/ranadeep-bania-front.png"
  );
  img_back = loadImage(
    "./assets/ranadeep-bania-back.png"
  );
}

function setup() {
  checkSize();
  createCanvas(size, (size * 5) / 4);
  frameRate(15);
  colorMode(HSB, 360);

  strokeJoin(ROUND);
  strokeCap(ROUND);

  loadButton();
}

function loadButton() {
  buttonSave = createButton("SAVE");
  buttonSave.addClass("save");
  buttonSave.mousePressed(saveSouvenir);
  buttonSave.position(size / 2 - 35, (size * 5) / 4 - 50);
}

function checkSize() {
  width = windowWidth;
  height = windowHeight;

  if (width > height) size = (height * 4) / 5;
  else size = width;

  if (size <= 400) scaleFactor = 3;
  if (size > 400 && size < 1200) scaleFactor = 2;
  if (size >= 1200) scaleFactor = 1;

  density = size / 4;
  centerVect = createVector(size / 2, (size * 5) / 8);
}

function windowResized() {
  checkSize();
  resizeCanvas(size, (size * 5) / 4);
  gemsVertex = [];
  buttonSave.position(size / 2 - 35, (size * 5) / 4 - 50);
}

function draw() {
  background(0, 0, 360);
  strokeWeight(1);

  image(img_back, 0, 0, size, (size * 5) / 4);

  for (let i = 0; i < numVertex; i++) {
    gemsVertex.push(generateGem());
  }
  for (let i = 0; i < numVertex; i++) {
    gemsVertex[i].update();
  }

  for (let i = 0; i < vertexXY.length; i++) {
    let colorSeed = round((map(i, 0, vertexXY.length, 0, 42) * numVertex) / 10);
    if (colorSeed > 360) colorSeed = 360;
    if (i + 2 < vertexXY.length) {
      stroke(360, 40);
      fill(colorSeed, 360, 360, 60); //   color
      beginShape();
      vertex(vertexXY[i][0].x, vertexXY[i][0].y);
      vertex(vertexXY[i][1].x, vertexXY[i][1].y);
      vertex(vertexXY[i + 1][0].x, vertexXY[i + 1][0].y);
      vertex(vertexXY[i + 1][1].x, vertexXY[i + 1][1].y);
      vertex(vertexXY[i + 2][0].x, vertexXY[i + 2][0].y);
      vertex(vertexXY[i + 2][1].x, vertexXY[i + 2][1].y);
      endShape(CLOSE);
    }
  }
  changeDirection();

  image(img_front, 0, 0, size, (size * 5) / 4);

  //   if (
  //     mouseX > size / 6 &&
  //     mouseX < (size * 5) / 6 &&
  //     mouseY > (size * 5) / 4 / 4 &&
  //     mouseY < (size * 5) / 4
  //   )
  buttonSave.show();
  // else buttonSave.hide();
}

function generateGem() {
  let gemsVertex = {};
  gemsVertex.position = createVector(
    width / 2 + random(size / -6, size / 6),
    height / 2 + random(size / -6, size / 6)
  );
  gemsVertex.direction = createVector(
    round(random()) * 2 - 1,
    round(random()) * 2 - 1
  );
  gemsVertex.update = function () {
    this.position.add(this.direction);

    if (round(centerVect.dist(this.position)) >= size / 2.5) {
      this.direction.rotate(PI);
      this.counter = pauseChange;
    }
    if (this.counter > 0) this.counter -= 1;
  };
  gemsVertex.counter = 0;
  return gemsVertex;
}

function changeDirection() {
  vertexXY = [];
  for (let i = 0; i < numVertex; i++) {
    for (let j = 0; j < numVertex; j++) {
      if (i != j) {
        let distance = p5.Vector.dist(
          gemsVertex[i].position,
          gemsVertex[j].position
        );
        if (distance < density) {
          if (gemsVertex[i].counter == 0) {
            gemsVertex[i].direction.rotate(random());
            gemsVertex[i].counter = pauseChange;
          }
          if (gemsVertex[j].counter == 0) {
            gemsVertex[j].direction.rotate(random());
            gemsVertex[j].counter = pauseChange;
          }
          vertexXY.push([gemsVertex[i].position, gemsVertex[j].position]);
        }
      }
    }
  }
}

// INTERACTION FUNCTIONS:

function saveSouvenir() {
  scaleSize();
  saveNum++;
  const zeroNum = (num, places) => String(saveNum).padStart(3, "0");
  saveCanvas(
    "Summer Solstice Generator by Ana Gasharova - " + zeroNum(3, saveNum),
    "png"
  );
  resizeCanvas(size, (size * 5) / 4);
}

function scaleSize() {
  resizeCanvas(size * scaleFactor, (size * scaleFactor * 5) / 4);
  image(img_back, 0, 0, size * scaleFactor, (size * scaleFactor * 5) / 4);
  push();
  scale(scaleFactor);
  strokeWeight(1 / scaleFactor);
  for (let i = 0; i < vertexXY.length; i++) {
    let colorSeed = round((map(i, 0, vertexXY.length, 0, 42) * numVertex) / 10);
    if (colorSeed > 360) colorSeed = 360;
    if (i + 2 < vertexXY.length) {
      stroke(360, 40);
      fill(colorSeed, 360, 360, 60); //   color
      beginShape();
      vertex(vertexXY[i][0].x, vertexXY[i][0].y);
      vertex(vertexXY[i][1].x, vertexXY[i][1].y);
      vertex(vertexXY[i + 1][0].x, vertexXY[i + 1][0].y);
      vertex(vertexXY[i + 1][1].x, vertexXY[i + 1][1].y);
      vertex(vertexXY[i + 2][0].x, vertexXY[i + 2][0].y);
      vertex(vertexXY[i + 2][1].x, vertexXY[i + 2][1].y);
      endShape(CLOSE);
    }
  }
  pop();
  image(img_front, 0, 0, size * scaleFactor, (size * scaleFactor * 5) / 4);
}
