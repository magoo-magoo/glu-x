import { LevelOne } from "./levelOne";
import { WeaponCapacity, InvincibilityCapacity } from "../sprites/Capacity";
import { Images } from "../assets";

export class Hud extends Phaser.Group {
  public readonly score: Phaser.Text;
  public readonly health: Phaser.Text;
  public readonly mapInfo: Phaser.Text;
  public readonly speed: Phaser.Text;
  public readonly positionText: Phaser.Text;
  public readonly bonus: Phaser.Text;
  public weaponCapacitySprite: Phaser.Sprite;
  public invicibilityCapacitySprite: Phaser.Sprite;
  // public bar: Phaser.TileSprite;

  constructor(game: Phaser.Game, private level: LevelOne) {
    super(game);
    this.score = this.game.add.text(10, 10, "Score: 0", {
      font: "18px Arial",
      fill: "#fff"
    });
    this.score.name = "score";

    this.health = this.game.add.text(10, 10, "Health: 0", {
      font: "18px Arial strong",
      fill: "#00ff00"
    });
    this.health.name = "health";

    this.mapInfo = this.game.add.text(10, 10, "Sprite: 0", {
      font: "18px Arial",
      fill: "#fff"
    });
    this.mapInfo.name = "mapInfo";

    this.speed = this.game.add.text(10, 10, "Speed: 0", {
      font: "18px Arial",
      fill: "#fff"
    });
    this.speed.name = "speed";

    this.positionText = this.game.add.text(10, 10, "Position: 0", {
      font: "18px Arial",
      fill: "#fff"
    });
    this.positionText.name = "position";

    const bonusGroup = this.game.add.group();
    this.bonus = this.game.add.text(10, 10, "Bonus: 0", {
      font: "18px Arial",
      fill: "#fff"
    });
    this.bonus.name = "bonus";
    bonusGroup.add(this.bonus);

    this.buildCapacities();

    this.addMultiple([
      // this.bar,
      this.score,
      this.health,
      this.mapInfo,
      this.speed,
      this.positionText,
      bonusGroup
    ]);
  }

  public buildCapacities() {
    this.weaponCapacitySprite = this.game.add.sprite(
      this.game.camera.width - 64,
      this.game.camera.height - 50,
      WeaponCapacity.rewardImage
    );
    this.weaponCapacitySprite.scale.set(1);
    this.weaponCapacitySprite.anchor.set(0.5);
    this.weaponCapacitySprite.fixedToCamera = true;

    this.invicibilityCapacitySprite = this.game.add.sprite(
      this.game.camera.width - 128,
      this.game.camera.height - 50,
      InvincibilityCapacity.rewardImage
    );
    this.invicibilityCapacitySprite.scale.set(1);
    this.invicibilityCapacitySprite.anchor.set(0.5);
    this.invicibilityCapacitySprite.fixedToCamera = true;

    this.addMultiple([
      this.weaponCapacitySprite,
      this.invicibilityCapacitySprite
    ]);
  }

  public update() {
    this.score.text = `
        Score: ${this.level.score}`;
    this.score.x = this.game.camera.x + 10;
    this.score.y = this.game.camera.y + 10;

    this.health.text = `
        Health: ${Math.round(this.level.spaceShip.health)}`;
    this.health.x = this.game.camera.x + 200;
    this.health.y = this.game.camera.y + 10;
    if (this.level.spaceShip.health < 66) {
      this.health.fill = "#ff6600";
    }
    if (this.level.spaceShip.health < 33) {
      this.health.fill = "#ff0000";
      this.health.fontWeight = "bold";
    }

    this.mapInfo.text = `
        Asteroids: ${
          this.level.asteroids.getAll("alive", true).length
        } Bonus: ${this.level.bonuses.getAll("alive", true).length}`;
    this.mapInfo.x = this.game.camera.x + 400;
    this.mapInfo.y = this.game.camera.y + 10;

    this.speed.text = `
        Speed: ${Math.round(this.level.spaceShip.body.speed)}`;
    this.speed.x = this.game.camera.x + 10;
    this.speed.y = this.game.camera.y + this.game.camera.height - 50;

    this.positionText.text = `
        Position(${Math.round(
          this.level.spaceShip.body.position.x
        )}, ${Math.round(this.level.spaceShip.body.position.y)})`;
    this.positionText.x = this.game.camera.x + 10 + 400;
    this.positionText.y = this.game.camera.y + this.game.camera.height - 50;

    const capacities = this.level.spaceShip.capacities;
    const weapon = capacities.weapon
      ? `Weapon: ${(capacities.weapon.timer.duration / 1000).toFixed(2)}`
      : "";

    this.bonus.text = `
      Bonus: ${weapon}`;
    this.bonus.x = this.game.camera.x + this.game.camera.width / 2 + 10;
    this.bonus.y = this.game.camera.y + this.game.camera.height - 50;

    this.weaponCapacitySprite.visible = !!this.level.spaceShip.capacities
      .weapon;
    this.invicibilityCapacitySprite.visible = !!this.level.spaceShip.capacities
      .invincibility;

    this.game.world.bringToTop(this);
  }
}
