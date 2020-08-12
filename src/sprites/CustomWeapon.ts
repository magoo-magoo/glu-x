import { CustomBullet, SimpleBullet, BlazorBullet } from "./CustomBullet";
import { Images } from "../assets";
import { Sprite } from "phaser-ce";
import { SpaceShip } from "./SpaceShip";

// tslint:disable:max-classes-per-file
export class CustomWeapon extends Phaser.Weapon {
  constructor(game: Phaser.Game, public owner: SpaceShip) {
    super(game, game.plugins);
    this.trackSprite(owner, 75, -10, true);
  }
}

export class SimpleWeapon extends CustomWeapon {
  constructor(game: Phaser.Game, owner: SpaceShip) {
    super(game, owner);

    this.bulletClass = SimpleBullet;
    this.bulletClass = SimpleBullet;
    this.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.bulletLifespan = 2000;
    this.bulletSpeed = 2000;
    this.fireRate = 150;
    this.bulletAngleOffset = 90;
    this.bulletSpeedVariance = 1000;
    this.fireRateVariance = 50;
    this.bulletInheritSpriteSpeed = true;
    this.createBullets(10, SimpleBullet.imageKey);
  }
}

export class BlasorWeapon extends CustomWeapon {
  constructor(game: Phaser.Game, owner: SpaceShip) {
    super(game, owner);

    this.bulletClass = BlazorBullet;
    this.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.bulletLifespan = 2000;
    this.bulletSpeed = 1500;
    this.fireRate = 100;
    this.bulletAngleOffset = 90;
    this.bulletInheritSpriteSpeed = true;
    this.createBullets(10, BlazorBullet.imageKey);
  }
}
