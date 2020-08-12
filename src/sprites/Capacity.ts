import { CustomWeapon } from "./CustomWeapon";
import { Images } from "../assets";
import { SpaceShip } from "./SpaceShip";
import { Sprite } from "phaser-ce";

// tslint:disable:max-classes-per-file

export type CapacityType = "weapon" | "invincibility" | "speedUp";

export class CapacityContainer {
  public weapon?: WeaponCapacity;
  public invincibility?: InvincibilityCapacity;
  public speedUp?: SpeedUpCapacity;

  public add(capacity: Capacity, owner: SpaceShip) {
    capacity.timer = owner.game.time.create();
    capacity.timer.add(capacity.duration, () => {
      this.remove(capacity);
    });
    capacity.timer.start();
    switch (capacity.type) {
      case "invincibility":
        this.remove(this.invincibility);
        this.invincibility = capacity;
        return;
      case "weapon":
        this.remove(this.weapon);
        this.weapon = capacity;
        this.weapon.weapon.owner = owner;
        this.weapon.weapon.trackedSprite = owner;
        return;
      case "speedUp":
        this.remove(this.speedUp);
        this.speedUp = capacity;
        return;
    }
  }

  public remove(capacity: Capacity) {
    if (!capacity) {
      return;
    }
    const current = this[capacity.type];
    if (current === capacity) {
      capacity.destroy();
      this[capacity.type] = null;
    }
  }
  public update() {
    if (this.invincibility) {
      this.invincibility.update();
    }
    if (this.weapon) {
      this.weapon.update();
    }
    if (this.speedUp) {
      this.speedUp.update();
    }
  }
}
export type Capacity = WeaponCapacity | InvincibilityCapacity | SpeedUpCapacity;

abstract class CapacityBase {
  public readonly type: CapacityType;
  public readonly duration: number;
  public readonly owner: Sprite;
  public timer: Phaser.Timer;

  constructor(owner: Sprite) {
    this.owner = owner;
  }

  public destroy(): void {
    this.timer.stop();
  }
  public update(): void {
    //
  }
}
export class WeaponCapacity extends CapacityBase {
  public static readonly image = Images.YellowBall.getName();
  public static readonly rewardImage = Images.Bullet1.getName();
  public rewardImage = WeaponCapacity.rewardImage;
  public readonly type = "weapon";
  public readonly duration = 10000;
  constructor(owner: Sprite, public readonly weapon: CustomWeapon) {
    super(owner);
  }
  public fire() {
    const bullet = this.weapon.fire();
    if (!bullet) {
      return [];
    }
    return [bullet];
  }
  public destroy(): void {
    super.destroy();
    this.weapon.game.time.events.add(1000, () => this.weapon.destroy());
  }
}
export class InvincibilityCapacity extends CapacityBase {
  public static readonly image = Images.BlueBall.getName();
  public static readonly rewardImage = Images.Shield3Small.getName();
  public rewardImage = InvincibilityCapacity.rewardImage;
  public readonly type = "invincibility";
  public readonly duration = 10000;
  public shield: Sprite;

  constructor(owner: Sprite) {
    super(owner);
    this.shield = owner.game.add.sprite(
      owner.x,
      owner.y,
      Images.ShieldSpritesheet.getName()
    );

    this.shield.anchor.set(owner.anchor.x, owner.anchor.y);
    const shieldScale = 2;
    this.shield.anchor.set(0.5, 0.4);
    this.shield.scale.set(shieldScale);
    this.shield.animations.add(Images.ShieldSpritesheet.getName());
    this.shield.play(Images.ShieldSpritesheet.getName(), 120, true);
    owner.game.physics.arcade.enable(this.shield);
    const shieldRadius = ((this.shield.width * (1 / shieldScale)) / 2) * 0.7;
    this.shield.body.setCircle(
      shieldRadius,
      -shieldRadius +
        (this.shield.anchor.x * this.shield.width) / this.shield.scale.x,
      -shieldRadius +
        (this.shield.anchor.y * this.shield.height) / this.shield.scale.y
    );
    (this.shield.body as Phaser.Physics.Arcade.Body).bounce.set(-1);
    (this.shield.body as Phaser.Physics.Arcade.Body).mass = 2;
    (this.shield.body as Phaser.Physics.Arcade.Body).moves = false;
  }

  public update(): void {
    this.shield.body.acceleration.set(0);
    this.shield.body.velocity.set(0);
    this.shield.x = this.owner.x;
    this.shield.y = this.owner.y;
  }

  public destroy() {
    this.shield.destroy();
    super.destroy();
  }
}
export class SpeedUpCapacity extends CapacityBase {
  public static readonly image = Images.RedBall.getName();
  public static readonly rewardImage = Images.RedBall.getName();
  public readonly type = "speedUp";
  public readonly duration = 10000;
  public readonly speedFactor = 1.5;
}
