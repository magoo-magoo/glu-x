import { Images } from "../assets";
import { randomInteger, randomBoolean } from "../utils/helpers";

export class Asteroid extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private readonly sign: number = randomBoolean() ? 1 : -1;
  private explosion: Phaser.Sprite;

  constructor(
    game: Phaser.Game,
    x: number,
    y: number,
    frame?: string | number
  ) {
    super(
      game,
      randomInteger(100, x),
      randomInteger(100, y),
      getRandomImage(),
      frame
    );
    this.scale.set(0.1);
    this.anchor.set(0.5);

    this.health = 100;
    this.game.physics.arcade.enable(this);
    this.body.maxAngular = randomInteger(10, 90);
    this.body.maxVelocity.setTo(50);
    this.body.acceleration.set(randomInteger(-10, 10), randomInteger(-10, 10));
    this.body.bounce.setTo(1);

    this.explosion = this.game.add.sprite(0, 0, Images.Explode.getName());
    this.explosion.anchor.set(0.5);
    this.explosion.animations.add(Images.Explode.getName());
  }

  public update() {
    this.body.angularVelocity = this.sign * randomInteger(0, 180);
  }

  public kill() {
    this.explosion.reset(this.body.x, this.body.y);
    this.explosion.play(Images.Explode.getName(), 30, false, true);
    return super.kill();
  }
}
const getRandomImage = () => {
  const n = randomInteger(1, 4);
  switch (n) {
    case 1:
      return Images.Asteroid1.getName();
    case 2:
      return Images.Asteroid2.getName();
    case 3:
      return Images.Asteroid3.getName();
    case 4:
      return Images.Asteroid4.getName();
  }

  throw new Error("getRandomImage: " + n);
};
