import { init, Sprite, Text } from 'kontra';

const { canvas, context } = init();

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

export const graveScenery = [
  graveGround,
  graveGroundBackCoverTrees,
  graveGroundBackCover,
  graveGroundCover,
  ...graveStones,
];