import '../style.css';
import {
  init,
  initPointer,
  Sprite,
  GameLoop,
  track,
  Text,
  onPointer,
  keyPressed,
  initKeys,
} from 'kontra';

let { canvas } = init();

initPointer();
initKeys();

const ammoType = [
  '💣',
  '🔪',
  '🧨',
  '💥',
  '👻',
  '😈',
  '🪓',
  '⚰️',
];

let ammoStripe = [];
let detachedBullets = [];

const graveGround = Sprite({
  color: '#4d2212',
  width: 600,
  height: 8,
  x: 0,
  y: 410,
});
const graveGroundCover = Sprite({
  color: 'rgba(101,39,0,0.51)',
  width: 600,
  height: 15,
  x: 0,
  y: 415,
});

const graveGroundBackCover = Sprite({
  color: 'rgba(133,133,133,0.35)',
  width: 600,
  height: 15,
  x: 0,
  y: 395,
});

const graveGroundBackCoverTrees = Sprite({
  color: 'rgba(36,77,0,0.68)',
  width: 600,
  height: 7,
  x: 0,
  y: 387,
});

const cyclist = Text({
  text: '🚴‍️',
  font: '40px Arial, sans-serif',
  color: 'white',
  anchor: { x: 0.5, y: 0.5 },
  x: canvas.width + 10,
  y: canvas.height / 4,
  ttl: 1,
  shouldBlow: false,
});

const ghost = Text({
  text: '👻',
  font: '40px Arial, sans-serif',
  color: 'white',
  anchor: { x: 0.5, y: 0.5 },
  x: -10,
  y: canvas.height / 4,
  ttl: 1,
});

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
      fireFirstAmmo();
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

function fireFirstAmmo() {
  const [firstBullet] = ammoStripe.splice(0, 1);
  const { x, y } = redTriangle;
  firstBullet.detach({ x, y, dy: 1 });
  detachedBullets.push(firstBullet);
  ammoStripe.map(
    (bullet, index) => {
      bullet.y = 450 + ((index + 1) * 40);
    },
  );
}

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

const graveStep = canvas.width / 5;

const graveStones = [1, 2, 3, 4, 5].map(
  index => {
    return Text({
      text: '🪦',
      font: '40px Arial, sans-serif',
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      x: index * graveStep - 60,
      y: canvas.height - 200,
      ttl: 1,
    });
  },
);

let sceneSprites = [
  cyclist,
  ghost,
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

    if(cyclist.isAlive() && cyclist.x > 300) {
      cyclist.x = cyclist.x - 0.5;
    }

    if (cyclist.x - (ghost.x + ghost.width) <= -10) {
      cyclist.ttl = 0;
      ghost.ttl = 0;
      sceneSprites = [];
      blowWithParts(cyclist.x, cyclist.y);
    }
    detachedBullets = detachedBullets.filter(
      bullet => bullet.isAlive(),
    )
  },
  render: function() { // render the game state
    graveGround.render();
    graveGroundCover.render();
    graveGroundBackCover.render();
    graveGroundBackCoverTrees.render();
    redTriangle.render();
    ammoStripe.map(ammo => ammo.render());
    graveStones.map(graveStone => graveStone.render());
    sceneSprites.forEach(sprite => sprite.render());
    detachedBullets.forEach(bullet => bullet.render());
  }
});

loop.start();    // start the game