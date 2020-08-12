import { Sprite } from "phaser-ce";
import { randomInteger, randomBoolean } from "../utils/helpers";
import {
  Capacity,
  WeaponCapacity,
  SpeedUpCapacity,
  InvincibilityCapacity
} from "./Capacity";
import { SpaceShip } from "./SpaceShip";
import { BlasorWeapon } from "./CustomWeapon";

const config = {
  bounce: 5,
  maxVelocity: 300,
  maxAngularRange: { min: 10, max: 90 },
  scale: 2,
  drag: 1000000
};

export class Bonus extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  public capacityFactory: capacityFactory;
  private readonly sign: number = randomBoolean() ? 1 : -1;

  public constructor(
    game: Phaser.Game,
    key: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
    frame: string | number,
    capacityFactorFunc: capacityFactory,
    public rewardImage: string
  ) {
    super(game, 0, 0, key, frame);
    this.game.physics.arcade.enable(this);
    this.capacityFactory = capacityFactorFunc;

    this.configure();
  }

  public configure() {
    this.position.set(
      randomInteger(100, this.game.world.width),
      randomInteger(100, this.game.world.height)
    );
    this.scale.set(config.scale);
    this.anchor.set(0.5);
    this.health = 3;
    this.body.maxAngular = randomInteger(
      config.maxAngularRange.min,
      config.maxAngularRange.max
    );
    this.body.drag.setTo(config.drag);
    this.body.acceleration.set(randomInteger(-10, 10), randomInteger(-10, 10));
    this.body.bounce.setTo(config.bounce);
    this.body.maxVelocity.setTo(config.maxVelocity);
    const radius = (this.width * (1 / config.scale)) / 2;
    this.body.setCircle(
      radius,
      -radius + (0.5 * this.width) / this.scale.x,
      -radius + (0.5 * this.height) / this.scale.y
    );
  }

  public apply(sprite: Sprite) {
    const tweenSprite = this.game.add.sprite(
      this.game.camera.width / 2,
      -100,
      this.rewardImage
    );

    tweenSprite.anchor.set(0.5);
    tweenSprite.fixedToCamera = true;

    const tween = this.game.add.tween(tweenSprite.cameraOffset).to(
      {
        y: this.game.camera.height / 2,
        scale: 2,
        alpha: 0.8
      },
      750,
      Phaser.Easing.Bounce.In,
      true
    );

    tween.onComplete.add(() => {
      const innerTween = this.game.add.tween(tweenSprite.cameraOffset).to(
        {
          x: this.game.camera.width,
          y: this.game.camera.height,
          scale: 4,
          alpha: 0.4
        },
        750,
        Phaser.Easing.Bounce.In,
        true
      );
      innerTween.onComplete.add(() => {
        tweenSprite.destroy();
      });
    });

    if (sprite instanceof SpaceShip) {
      sprite.capacities.add(this.capacityFactory(sprite), sprite);
    }
  }

  public kill() {
    return super.kill();
  }
  public update() {
    this.body.angularVelocity = this.sign * randomInteger(0, 180);
  }
}
export type capacityFactory = (spaceShip: SpaceShip) => Capacity;

export const makeRandomBonus = (game: Phaser.Game) => {
  const n = randomInteger(1, 30);
  let capacityFactFunc: capacityFactory;
  let image: string;
  let rewardImage: string;
  if (n <= 5) {
    capacityFactFunc = owner => new SpeedUpCapacity(owner);
    image = SpeedUpCapacity.image;
    rewardImage = SpeedUpCapacity.rewardImage;
  } else if (n <= 15) {
    capacityFactFunc = owner => new InvincibilityCapacity(owner);
    image = InvincibilityCapacity.image;
    rewardImage = InvincibilityCapacity.rewardImage;
  } else if (n <= 30) {
    capacityFactFunc = owner =>
      new WeaponCapacity(owner, new BlasorWeapon(game, owner));
    image = WeaponCapacity.image;
    rewardImage = WeaponCapacity.rewardImage;
  } else {
    throw Error(`capacity.random: ${n}`);
  }

  return new Bonus(
    game,
    image,
    null,
    capacityFactFunc,
    rewardImage
  );
};
