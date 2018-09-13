import { Sprite } from "phaser-ce";

export class Bonus extends Phaser.Sprite {
  constructor(
    game: Phaser.Game,
    x: number,
    y: number,
    key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
    frame?: string | number
  ) {
    super(game, x, y, key, frame);
    this.scale.set(3);
    this.game.physics.enable(this);
  }

  public apply(sprite: Sprite) {
      this.kill();
  }

  public update() {
    //
  }
}
