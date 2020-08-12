import { Images } from "../assets";
import { Asteroid } from "../sprites/Asteroid";
import { SpaceShip } from "../sprites/SpaceShip";
import { CustomBullet } from "../sprites/CustomBullet";
import { Bonus, makeRandomBonus } from "../sprites/Bonus";
import { Hud } from "./Hud";
import { Group } from "phaser-ce";
import { AsteroidGroup } from "./AsteroidGroup";
import { BonusGroup } from "./BonusGroup";

const FACTOR = 0.4;
export const levelConfig = {
  gameWidth: (4 * DEFAULT_GAME_WIDTH) / FACTOR,
  gameHeight: (4 * DEFAULT_GAME_HEIGHT) / FACTOR,
  asteroids: 200 / FACTOR,
  bonus: 70 / FACTOR,
  background: Images.Starfield.getName(),
  speed: 100 / FACTOR,
  collision: {
    spaceShipAsteroid: {
      shake: {
        intensity: 0.01,
        duration: 200
      },
      flash: {
        color: 0xff0000,
        duration: 250,
        alpha: 0.3
      }
    }
  },
  asteroid: {
    scale: 0.1,
    health: 10,
    maxAngularRange: { min: 10, max: 90 },
    maxVelocity: 50,
    bounce: 1
  },
  spaceShip: {
    health: 100,
    image: Images.Mship1Small.getName(),
    scale: 0.1,
    collideWorldBounds: true,
    bounce: 0.5,
    drag: 100,
    angularDrag: 5000,
    angularVelocity: 180,
    speed: 250
  },
  debug: false
} as const;



// tslint:disable-next-line:max-classes-per-file
export class LevelOne extends Phaser.State {
  public spaceShip: SpaceShip;
  public starfield: Phaser.TileSprite;
  public asteroids: AsteroidGroup;
  public bonuses: BonusGroup;
  public hud: Hud;
  public score: number = 0;

  public preload() {
    this.game.load.spritesheet(
      Images.Explode.getName(),
      Images.Explode1.getPNG(),
      128,
      128
    );
    this.game.load.spritesheet(
      Images.ShieldSpritesheet.getName(),
      Images.ShieldSpritesheet.getPNG(),
      192,
      192
    );
  }
  public create() {
    this.starfield = this.game.add.tileSprite(
      0,
      0,
      levelConfig.gameWidth,
      levelConfig.gameHeight,
      levelConfig.background
    );
    this.starfield.autoScroll(0, levelConfig.speed / 5);
    this.game.world.setBounds(0, 0, levelConfig.gameWidth, levelConfig.gameHeight);
    this.game.physics.arcade.skipQuadTree = true;

    this.spaceShip = new SpaceShip(
      this.game,
      this.game.world.centerX,
      this.game.world.centerY,
      levelConfig.spaceShip
    );
    this.game.add.existing(this.spaceShip);
    this.game.camera.follow(
      this.spaceShip,
      Phaser.Camera.FOLLOW_TOPDOWN_TIGHT,
      0.1,
      0.1
    );

    this.hud = new Hud(this.game, this);

    this.asteroids = new AsteroidGroup(
      this.game,
      levelConfig.asteroids,
      () => (this.score += 3)
    );
    this.bonuses = new BonusGroup(this.game, levelConfig.bonus, () => {
      this.score += 100;
      this.game.camera.flash(0xffffff, 250, true, 0.5);
    });

    this.add.existing(this.asteroids);
  }

  public buildBonusesGroup(count: number) {
    const group = new Group(this.game);
    for (let i = 0; i < count; i++) {
      const bonus = makeRandomBonus(this.game);
      bonus.events.onKilled.add((b: Bonus) => {
        this.score += 100;
        this.game.camera.flash(0xffffff, 250, true, 0.5);
      });
      group.add(bonus);
    }
    return group;
  }

  public update() {
    this.game.physics.arcade.collide(this.asteroids);
    this.game.physics.arcade.collide(this.bonuses);

    if (this.spaceShip.capacities.invincibility) {
      this.game.physics.arcade.collide(
        this.spaceShip.capacities.invincibility.shield,
        this.asteroids,
        spaceShipShieldAsteroid
      );
    }

    this.game.physics.arcade.collide(
      this.spaceShip,
      this.asteroids,
      spaceShipAsteroid
    );

    this.game.physics.arcade.collide(
      this.spaceShip.bullets,
      this.asteroids,
      bulletsAsteroids
    );

    this.game.physics.arcade.collide(
      this.spaceShip.bullets.filter(b => b.alive),
      this.bonuses,
      bulletsBonuses
    );

    this.game.physics.arcade.collide(
      this.spaceShip,
      this.bonuses,
      spaceShipBonus
    );

    this.game.physics.arcade.collide(this.asteroids, this.bonuses);

    this.world.wrapAll(this.asteroids);
    this.world.wrapAll(this.bonuses);
  }

  public render() {
    // Sprite debug info
    if (levelConfig.debug) {
      // this.game.debug.bodyInfo(this.spaceShip, 32, 30);
      // this.game.debug.spriteInfo(this.spaceShip, 32, 130);
      this.game.debug.body(this.spaceShip, "green", false);
      // this.game.debug.physicsGroup(this.asteroids, "red", false);
      // this.game.debug.cameraInfo(this.game.camera, 32, 200);
      // this.spaceShip.weapon.forEach(bullet => {
      //   this.game.debug.spriteInfo(bullet, 300, 300);
      // }, null);
      if (this.spaceShip.capacities.weapon) {
        this.game.debug.text(
          `weapon timer: ${this.spaceShip.capacities.weapon.timer.duration}`,
          500,
          500
        );
      }
      // this.game.debug.quadTree(this.game.physics.arcade.quadTree, "darkblue");
      this.game.debug.physicsGroup(this.bonuses, "red", false);
      this.spaceShip.bullets.forEach(b =>
        this.game.debug.body(b, "pink", false)
      );
      this.game.debug.physicsGroup(this.asteroids, "blue", false);
      this.spaceShip.weapon.debug(32, 400, false);
    }
  }
}

const spaceShipAsteroid = (ship: SpaceShip, asteroid: Asteroid) => {
  ship.game.camera.shake(
    levelConfig.collision.spaceShipAsteroid.shake.intensity,
    levelConfig.collision.spaceShipAsteroid.shake.duration,
    true
  );
  ship.game.camera.flash(
    levelConfig.collision.spaceShipAsteroid.flash.color,
    levelConfig.collision.spaceShipAsteroid.flash.duration,
    true,
    levelConfig.collision.spaceShipAsteroid.flash.alpha
  );
  ship.damage(asteroid.health);
  asteroid.damage(3);
};
const spaceShipShieldAsteroid = (ship: SpaceShip, asteroid: Asteroid) => {
  asteroid.damage(3);
};

const bulletsAsteroids = (bullet: CustomBullet, asteroid: Asteroid) =>
  bullet.collide(asteroid);

const spaceShipBonus = (spaceShip: SpaceShip, bonus: Bonus) => {
  bonus.damage(1);
  if (!bonus.alive) {
    bonus.apply(spaceShip);
  }
};
const bulletsBonuses = (bullet: CustomBullet, bonus: Bonus) => {
  bullet.collide(bonus);
  if (!bonus.alive) {
    bonus.apply((bullet.game.state.getCurrentState() as LevelOne).spaceShip);
  }
};
