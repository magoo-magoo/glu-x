import { Images } from "../assets";
import { SimpleWeapon } from "./CustomWeapon";
import { CapacityContainer } from "./Capacity";
import { Bullet } from "phaser-ce";
import {levelConfig} from "../states/levelOne";

export class SpaceShip extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  public weapon: Phaser.Weapon;
  public capacities: CapacityContainer = new CapacityContainer();
  public bullets: Bullet[];

  private cursors: Phaser.CursorKeys;
  private fireButton: Phaser.Key;
  private shipTrail: Phaser.Particles.Arcade.Emitter;

  constructor(
    game: Phaser.Game,
    x: number,
    y: number,
    private config: Readonly<typeof levelConfig.spaceShip>,
    frame?: string | number,
    
  ) {
    super(game, x, y, config.image, frame);

    this.scale.set(config.scale);
    this.anchor.set(0.5);
    this.health = config.health;
    this.bullets = [];

    this.game.physics.arcade.enable(this, true);
    this.body.bounce.setTo(config.bounce);
    this.body.collideWorldBounds = config.collideWorldBounds;
    this.body.drag.setTo(config.drag);
    this.body.angularDrag = config.angularDrag;
    this.body.maxVelocity.setTo(config.speed);

    const radius = ((this.width * (1 / config.scale)) / 2) * 0.7;
    this.body.setCircle(
      radius,
      -radius + (this.anchor.x * this.width) / this.scale.x,
      -radius + (this.anchor.y * this.height) / this.scale.y
    );

    this.weapon = new SimpleWeapon(this.game, this);

    this.shipTrail = game.add.emitter(this.x, this.y + 10, 400);
    this.shipTrail.width = 10;
    this.shipTrail.makeParticles(Images.Bullet.getName());
    this.shipTrail.setXSpeed(30, -30);
    this.shipTrail.setYSpeed(200, 180);
    this.shipTrail.setRotation(50, -50);
    // this.shipTrail.setAlpha(1, 0.01, 800);
    this.shipTrail.setScale(
      0.05,
      0.4,
      0.05,
      0.4,
      2000,
      Phaser.Easing.Quintic.Out
    );
    this.shipTrail.start(false, 5000, 10);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  }

  public damage(amount: number) {
    if (!this.capacities.invincibility) {
      super.damage(amount);
    }
    return this;
  }

  public update() {
    const speedFactor = this.capacities.speedUp
      ? this.capacities.speedUp.speedFactor
      : 1;

    if (this.game.input.activePointer.withinGame) {
      this.rotation = this.game.physics.arcade.angleToPointer(this);
      this.thurst(speedFactor);
    } else {
      if (this.cursors.up.isDown) {
        this.thurst(speedFactor);
      } else if (this.cursors.down.isDown) {
        this.reverse(-0.5 * speedFactor);
      } else {
        this.body.acceleration.set(0);
      }

      if (this.cursors.left.isDown) {
        this.rotateLeft(speedFactor);
      } else if (this.cursors.right.isDown) {
        this.rotateRight(speedFactor);
      }
    }

    if (this.fireButton.isDown || this.game.input.activePointer.isDown) {
      const fired = this.fire();
      this.bullets = this.bullets.concat(fired);
    }

    this.bullets = this.bullets.filter(b => b.alive);

    const px = this.body.velocity.x * -1;
    const py = this.body.velocity.y * -1;

    this.shipTrail.minParticleSpeed.set(px, py);
    this.shipTrail.maxParticleSpeed.set(px, py);
    this.shipTrail.emitX = this.left;
    this.shipTrail.emitY = this.left;

    this.capacities.update();
  }

  public rotateRight(speedFactor: number) {
    this.body.angularVelocity = this.config.angularVelocity * speedFactor;
  }

  public rotateLeft(speedFactor: number) {
    this.body.angularVelocity = -this.config.angularVelocity * speedFactor;
  }

  public reverse(speedFactor: number) {
    this.game.physics.arcade.accelerationFromRotation(
      this.rotation,
      this.config.speed * speedFactor,
      this.body.acceleration
    );
  }

  public thurst(speedFactor: number) {
    this.game.physics.arcade.accelerationFromRotation(
      this.rotation,
      this.config.speed * speedFactor,
      this.body.acceleration
    );
  }

  public fire() {
    if (this.capacities.weapon) {
      return this.capacities.weapon.fire();
    }
    const bullet = this.weapon.fire();
    if (!bullet) {
      return [];
    }
    return [bullet];
  }
}
