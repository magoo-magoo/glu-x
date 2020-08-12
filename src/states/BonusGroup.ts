import { Bonus, makeRandomBonus } from "../sprites/Bonus";

export class BonusGroup extends Phaser.Group {
  constructor(
    game: Phaser.Game,
    public max: number,
    onKilled: (a: Bonus) => void
  ) {
    super(game);
    for (let i = 0; i < max; i++) {
      const bonus = makeRandomBonus(this.game);
      bonus.events.onKilled.add(onKilled);
      this.add(bonus);
    }
  }

  public update() {
    super.update();

    const toRevive = this.max - this.countLiving();
    for (let i = 0; i < toRevive; i++) {
      const bonus: Bonus = this.getFirstDead();
      bonus.reset(0, 0);
      bonus.configure();
    }
  }
}
