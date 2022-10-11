import {
  init,
  initPointer,
  GameLoop,
  track,
  Text,
  onPointer,
  keyPressed,
  initKeys,
} from 'kontra';

import '../style.css';

import { ammoType } from './ammo-stripe/ammo-type.js';
import { ammoStripe } from './ammo-stripe/ammo-stripe.js';
import { detachedBullets } from './ammo-stripe/helpers.js';
import { fireFirstAmmo } from './ammo-stripe/helpers.js';
import { livingSubjects } from './living-objects/living-object-type.js';
import { transports } from './transports/transport-type.js';
import { graveScenery } from './decoration-components';

let { canvas, context } = init();

initPointer();
initKeys();

let movingObjects = [];

const redTriangle = Text({
  text: '🔺',
  font: '40px Arial, sans-serif',
  color: 'red',
  anchor: { x: 0.5, y: 0.5 },
  x: 60 + canvas.width / 5 * 2,
  y: 450,
  ttl: 1,
  isKeyProcessing: false,
  isRecharging: false,
  keyTimeout: 100,
  ammoReload: 1000,
  update() {
    if (this.isKeyProcessing) {
      return;
    }
    const hasRightBorderPosition = this.x === 60 + canvas.width / 5 * 4;
    const hasLeftBorderPosition = this.x === 60;

    if (keyPressed('arrowleft') && !hasLeftBorderPosition) {
      this.isKeyProcessing = true;
      this.x = this.x - canvas.width / 5;
      setTimeout(() => this.isKeyProcessing = false, this.keyTimeout);
    }
    if (keyPressed('arrowright') && !hasRightBorderPosition) {
      this.isKeyProcessing = true;
      this.x = this.x + canvas.width / 5;
      setTimeout(() => this.isKeyProcessing = false, this.keyTimeout);
    }
    if (keyPressed('arrowup') && !this.isRecharging) {
      this.isKeyProcessing = true;
      const { x, y } = redTriangle;
      fireFirstAmmo({ x, y });
      this.isRecharging = true;

      loadRandomAmmo(ammoStripe, { x: this.x, y: ammoPositionThree, freeze: true });
      ammoStripe.forEach(ammo => {
        ammo.isKeyProcessing = true;
        setTimeout(() => ammo.isKeyProcessing = false, this.keyTimeout);
      })
      setTimeout(() => this.isKeyProcessing = false, this.keyTimeout);
      setTimeout(() => this.isRecharging = false, this.ammoReload);
    }
  }
});

const ammoPositionOne = 450 + 40;
const ammoPositionTwo = 450 + 80;
const ammoPositionThree = 450 + 120;

const initialGamePositionX = 60 + canvas.width / 5 * 2;

loadRandomAmmo(ammoStripe);
loadRandomAmmo(ammoStripe, { y: ammoPositionTwo });
loadRandomAmmo(ammoStripe, { y: ammoPositionThree });

function loadRandomAmmo(ammoStripe, { x = initialGamePositionX, y = ammoPositionOne, freeze = false } = {}) {
  const randomIndex = parseInt(Math.random() * 100, 10) % ammoType.length;
  const randomAmmo = ammoType[randomIndex];

  return ammoStripe.push(
    Text({
      text: randomAmmo,
      font: '40px Arial, sans-serif',
      anchor: { x: 0.5, y: 0.5 },
      isDetached: false,
      ttl: 1,
      isInStripe: true,
      x,
      y,
      dy: 0,
      isKeyProcessing: freeze,
      keyTimeout: 100,
      detach({ x, y, dy = 1 }) {
        this.isDetached = true;
        this.isInStripe = false;
        this.x = x;
        this.y = y;
        this.dy = dy;
      },
      update() {
        if (this.isDetached) {
          if (this.y <= 0) {
            this.ttl = 0;
          }
          this.y = this.y - this.dy;
          this.rotation = this.rotation - this.dy / 20;
        }
        if (!this.isInStripe || this.isKeyProcessing) {
          return;
        }
        const hasRightBorderPosition = this.x === 60 + canvas.width / 5 * 4;
        const hasLeftBorderPosition = this.x === 60;

        if (keyPressed('arrowleft') && !hasLeftBorderPosition) {
          this.isKeyProcessing = true;
          this.x = this.x - canvas.width / 5;
          setTimeout(() => this.isKeyProcessing = false, this.keyTimeout);
        }
        if (keyPressed('arrowright') && !hasRightBorderPosition) {
          this.isKeyProcessing = true;
          this.x = this.x + canvas.width / 5;
          setTimeout(() => this.isKeyProcessing = false, this.keyTimeout);
        }
      },
    }),
  );
}

function createRandomLivingSubject() {
  const randomIndex = parseInt(Math.random() * 100, 10) % livingSubjects.length;
  console.log(Math.random(1, 100) * 10);
  const livingObject = Text({
    text: livingSubjects[randomIndex],
    font: '40px Arial, sans-serif',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    x: canvas.width + 10 + parseInt(Math.random(40, 80) * 80, 10) ,
    y: canvas.height / 4,
    ttl: 1,
    shouldBlow: false,
    update() {
      this.x = this.x - 0.5;
    },
  });
  return livingObject;
}

movingObjects = [
  createRandomLivingSubject(),
  createRandomLivingSubject(),
];



// let button = Button({
//   // sprite properties
//   x: 300,
//   y: 100,
//   anchor: {x: 0.5, y: 0.5},
//
//   text: {
//     text: '⚰️⚰️⚰️ Start ⚰️⚰️⚰️',
//     color: 'white',
//     font: '20px Arial, sans-serif',
//     anchor: {x: 0.5, y: 0.5}
//   },
//
//   onDown() {
//     this.y += 5;
//   },
//   onUp() {
//     this.y -= 5;
//   },
//
//   render() {
//     if(this.pressed) {
//       gameStarted = true;
//     }
//   }
// });


let sceneSprites = [
  ...movingObjects,
];

function blowWithParts(x, y) {
  const nose = Text({
    text: '👃',
    font: '25px Arial, sans-serif',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    x: x + 25,
    y,
    ttl: 1,
  });
  const lungs = Text({
    text: '🫁',
    font: '25px Arial, sans-serif',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    x: x - 30,
    y,
    ttl: 1,
  });
  const heart = Text({
    text: '🫀',
    font: '25px Arial, sans-serif',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    x,
    y: y + 15,
    ttl: 1,
  });
  const legOne = Text({
    text: '🦵',
    font: '25px Arial, sans-serif',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    x: x - 20,
    y: y - 15,
    ttl: 1,
  });
  const legTwo = Text({
    text: '🦵',
    font: '25px Arial, sans-serif',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    x: x + 20,
    y: y + 15,
    ttl: 1,
  });
  return sceneSprites.push(nose, legOne, legTwo, heart, lungs);
}

let loop = GameLoop({  // create the main game loop
  update: function() { // update the game state
    redTriangle.update();
    ammoStripe.map(ammo => ammo.update());
    detachedBullets.map(bullet => bullet.update());
    sceneSprites.forEach(sprite => sprite.update());
    // if(cyclist.isAlive() && cyclist.x > -50) {
    //   cyclist.x = cyclist.x - 0.5;
    // }

    detachedBullets.forEach(
      bullet => {
        movingObjects.find();
        const bulletXBetweenCyclistX = bullet.x >= cyclist.x && bullet.x <= cyclist.x + cyclist.width
        const bulletYBetweenCyclistY = bullet.y >= cyclist.y && bullet.y <= cyclist.y + cyclist.height;
        if (bulletXBetweenCyclistX && bulletYBetweenCyclistY) {
          cyclist.ttl = 0;
          bullet.ttl = 0;
          sceneSprites = [];
          blowWithParts(cyclist.x, cyclist.y);
        }
      },
    )

    const stillAliveDetachedBullets = detachedBullets.filter(
      bullet => bullet.isAlive(),
    );
    detachedBullets.splice(0, detachedBullets.length);
    detachedBullets.push(...stillAliveDetachedBullets);
  },
  render: function() {
    redTriangle.render();
    ammoStripe.map(ammo => ammo.render());
    sceneSprites.forEach(sprite => sprite.render());
    detachedBullets.forEach(bullet => bullet.render());

    graveScenery.forEach(sceneryElement => {
      sceneryElement.context = context;
      return sceneryElement.render();
    });
  }
});

loop.start();    // start the game