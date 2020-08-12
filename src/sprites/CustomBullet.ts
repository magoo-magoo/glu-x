import { Images } from "../assets";

// tslint:disable:max-classes-per-file


export abstract class CustomBullet extends Phaser.Bullet {
  public abstract readonly damagePoint;
  public collide(sprite: Phaser.Sprite) {
    sprite.damage(this.damagePoint);
    this.damage(1);
  }
}

export class SimpleBullet extends CustomBullet {
  public static readonly imageKey = Images.Bullet0.getName();
  public damagePoint = 2;
}
export class BlazorBullet extends CustomBullet {
  public static readonly imageKey = Images.Bullet1.getName();
  public damagePoint = 10;
  public health = 1;
}
