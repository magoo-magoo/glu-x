import { Images } from "../assets";

export default class Title extends Phaser.State {
  public create(): void {
    this.game.camera.flash(0xffffff, 5000);
    const text = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY / 2,
      "Glu-X"
    );
    text.anchor.set(0.5);
    text.align = "center";

    text.font = "Arial Black";
    text.fontSize = 70;
    text.fontWeight = "bold";
    text.fill = "#ec008c";

    text.setShadow(0, 0, "rgba(0, 0, 0, 0.5)", 0);
    const start = () => this.game.state.start("levelOne");
    const startKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    startKey.onDown.add(() => start());
    
    const button = this.game.add.button(
      this.game.world.centerX,
      this.game.world.centerY,
      Images.Start.getName(),
      start,
      this,
      2,
      1,
      0
    );
    button.anchor.set(0.5);
    button.scale.set(0.2);
  }
}
