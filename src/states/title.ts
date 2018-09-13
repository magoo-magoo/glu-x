export default class Title extends Phaser.State {
    public create(): void {
        this.game.camera.flash(0xFFFFFF, 5000);
        this.game.state.start('levelOne');
    }
}
