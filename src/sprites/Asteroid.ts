import { Images } from "../assets";
import { randomInteger, randomBoolean } from "../utils/helpers";
import { levelConfig } from "../states/levelOne";

export class Asteroid extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private readonly sign: number = randomBoolean() ? 1 : -1;
  private explosion: Phaser.Sprite;

  constructor(game: Phaser.Game, private config: Readonly<typeof levelConfig.asteroid>,  frame?: string | number) {
    super(game, 0, 0, getRandomImage(), frame);

    this.game.physics.arcade.enable(this);
    this.configure();
  }

  public configure() {
    this.position.set(
      randomInteger(100, this.game.world.width),
      randomInteger(100, this.game.world.height)
    );
    this.scale.set(this.config.scale);
    this.anchor.set(0.5); 
    this.health = this.config.health;
    this.body.maxAngular = randomInteger(
      this.config.maxAngularRange.min,
      this.config.maxAngularRange.max
    );
    this.body.maxVelocity.setTo(this.config.maxVelocity);
    this.body.acceleration.set(randomInteger(-10, 10), randomInteger(-10, 10));
    this.body.bounce.setTo(this.config.bounce);
    const radius = ((this.width * (1 / this.scale.getMagnitude())) / 2) * 0.8;
    this.body.setCircle(
      radius,
      -radius + (0.5 * this.width) / this.scale.x,
      -radius + (0.5 * this.height) / this.scale.y
    );

    this.explosion = this.game.add.sprite(0, 0, Images.Explode.getName());
    this.game.physics.arcade.enable(this.explosion);
    this.explosion.visible = false;
    this.explosion.anchor.set(0.5);
    this.explosion.animations.add(Images.Explode.getName());
  }

  public update() {
    this.body.angularVelocity = this.sign * randomInteger(0, 180);
  }

  public kill() {
    this.explosion.reset(this.body.x, this.body.y);
    this.explosion.body.velocity = this.body.velocity;
    this.explosion.body.velocity.setMagnitude(100);
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

// tslint:disable-next-line: max-classes-per-file
export class BigAsteroid extends Asteroid {

  constructor(game: Phaser.Game, config: Readonly<typeof levelConfig.asteroid>, frame?: string | number){
    super(game,  config, frame);
    this.scale.set(config.scale * 5);
  }

}