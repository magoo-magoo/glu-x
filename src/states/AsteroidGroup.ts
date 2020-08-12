import { Asteroid } from "../sprites/Asteroid";
import { levelConfig } from "./levelOne";
export class AsteroidGroup extends Phaser.Group {
  constructor(
    game: Phaser.Game,
    public max: number,
    onKilled: (a: Asteroid) => void
  ) {
    super(game);
    for (let i = 0; i < max; i++) {
      const asteroid = new Asteroid(this.game, levelConfig.asteroid);
      asteroid.events.onKilled.add(onKilled);
      this.add(asteroid);
    }
  }

  public update() {
    super.update();

    const toRevive = this.max - this.countLiving();
    for (let i = 0; i < toRevive; i++) {
      const asteroid: Asteroid = this.getFirstDead();
      asteroid.reset(100, 100);
      asteroid.configure();
    }
  }
}
