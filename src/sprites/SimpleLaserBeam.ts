export class CustomBullet extends Phaser.Sprite {
  public readonly damagePoint = 15;
  public collide(sprite: Phaser.Sprite) {
    sprite.damage(this.damagePoint);
    this.kill();
  }
}
