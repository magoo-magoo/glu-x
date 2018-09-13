import { Images } from "../assets";
import { Asteroid } from "../sprites/Asteroid";
import { SpaceShip } from "../sprites/SpaceShip";
import { CustomBullet } from "../sprites/SimpleLaserBeam";
import { Bonus } from "../sprites/Bonus";
import { Group } from "phaser-ce";

export class LevelOne extends Phaser.State {
  private spaceShip: SpaceShip;
  private starfield: Phaser.TileSprite;
  private asteroids: Phaser.Group;
  private bonuses: Phaser.Group;

  public preload() {
    this.game.load.spritesheet(
      Images.Explode.getName(),
      Images.Explode1.getPNG(),
      128,
      128
    );
  }
  public create() {
    this.starfield = this.game.add.tileSprite(
      0,
      0,
      1920,
      1920,
      Images.Starfield.getName()
    );
    this.game.world.setBounds(0, 0, 1920, 1920);

    this.spaceShip = new SpaceShip(
      this.game,
      this.game.world.centerX,
      this.game.world.centerY
    );
    this.game.add.existing(this.spaceShip);
    this.game.camera.follow(
      this.spaceShip,
      Phaser.Camera.FOLLOW_LOCKON,
      0.1,
      0.1
    );

    this.asteroids = this.buildAsteroidsGroup(70);
    this.bonuses = this.buildBonusesGroup();
  }

  public buildBonusesGroup() {
    const group = new Group(this.game);
    const bonus = new Bonus(
      this.game,
      this.spaceShip.x + 70,
      this.spaceShip.y + 70,
      Images.YellowBall.getName()
    );
    group.add(bonus);
    group.add(
      new Bonus(
        this.game,
        this.spaceShip.x + 200,
        this.spaceShip.y + 200,
        Images.BlueBall.getName()
      )
    );
    return group;
  }
  public buildAsteroidsGroup(count: number) {
    const group = new Group(this.game);
    for (let i = 0; i < count; i++) {
      const asteroid = new Asteroid(
        this.game,
        this.game.world.width,
        this.game.world.height
      );
      group.add(asteroid);
    }
    return group;
  }
  public update() {
    this.starfield.tilePosition.y += 0.3;
    this.bonuses.forEach(b => (b.position.y += 0.3), this);

    this.game.physics.arcade.collide(this.spaceShip, this.asteroids);
    this.game.physics.arcade.collide(this.asteroids);
    this.game.physics.arcade.collide(
      this.spaceShip.weapon.bullets,
      this.asteroids,
      (bullet: CustomBullet, asteroid: Asteroid) => bullet.collide(asteroid)
    );
    this.game.physics.arcade.overlap(
      this.spaceShip,
      this.bonuses,
      (spaceShip, bonus) => bonus.apply(spaceShip)
    );

    this.world.wrapAll(this.asteroids);
    this.world.wrapAll(this.bonuses);
  }

  public render() {
    // Sprite debug info
    // this.game.debug.bodyInfo(this.spaceShip, 32, 30);
    // this.game.debug.body(this.spaceShip);
    // this.game.debug.physicsGroup(this.asteroids);
    // this.game.debug.cameraInfo(this.game.camera, 32, 200);
    // this.spaceShip.weapon.forEach(bullet => {
    //   this.game.debug.spriteInfo(bullet, 300, 300);
    // }, null);
    this.spaceShip.weapon.debug(32, 400, false);
  }
}
