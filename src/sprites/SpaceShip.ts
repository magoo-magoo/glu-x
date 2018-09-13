import { Images } from "../assets";
import { CustomBullet } from "./SimpleLaserBeam";
import { Point } from "phaser-ce";

export class SpaceShip extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;

  public weapon: Phaser.Weapon;
  private cursors: Phaser.CursorKeys;
  private fireButton: Phaser.Key;
  constructor(
    game: Phaser.Game,
    x: number,
    y: number,
    frame?: string | number
  ) {
    super(game, x, y, Images.Blueships1.getName(), frame);

    this.scale.set(0.1);
    this.anchor.set(0.5);

    this.game.physics.arcade.enable(this, true);
    this.body.bounce.setTo(0.5, 0.5);
    this.body.collideWorldBounds = true;
    this.body.drag.setTo(10);
    this.body.angularDrag = 75;
    this.body.maxVelocity.setTo(400);

    this.weapon = new Phaser.Weapon(this.game, this.game.plugins);
    this.weapon.bulletClass = CustomBullet;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon.bulletLifespan = 500;
    this.weapon.bulletSpeed = 1000;
    this.weapon.fireRate = 75000000;
    this.weapon.createBullets(8, Images.BlueLaserBeamPng6.getName());
    this.weapon.trackSprite(this, 50, 0, true);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  }

  public update() {
    if (this.cursors.left.isDown) {
      this.body.angularVelocity = -75;
    } else if (this.cursors.right.isDown) {
      this.body.angularVelocity = 75;
    }

    if (this.cursors.up.isDown) {
      this.game.physics.arcade.accelerationFromRotation(
        this.rotation,
        300,
        this.body.acceleration
      );
    } else if (this.cursors.down.isDown) {
      this.game.physics.arcade.accelerationFromRotation(
        this.rotation,
        -300,
        this.body.acceleration
      );
    } else {
      this.body.acceleration.set(0);
    }

    if (this.fireButton.isDown) {
      this.weapon.fireMany([new Point(-5, 5), new Point(5, -5)]);
    }
  }

  public render() {
    this.weapon.debug();
  }
}
