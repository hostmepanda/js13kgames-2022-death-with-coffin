import { ammoStripe } from './ammo-stripe.js';

export let detachedBullets = [];

export const fireFirstAmmo = ({ x, y }) => {
  const [firstBullet] = ammoStripe.splice(0, 1);
  firstBullet.detach({ x, y, dy: 1 });
  detachedBullets.push(firstBullet);
  ammoStripe.map(
    (bullet, index) => {
      bullet.y = 450 + ((index + 1) * 40);
    },
  );
}