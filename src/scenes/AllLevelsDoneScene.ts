export default class AllLevelsDoneScene extends Phaser.Scene {
  protected dim: Phaser.GameObjects.Rectangle | null = null;

  constructor() {
    super({
      key: "AllLevelsDoneScene",
    });
  }

  create() {
    console.log("all levels done scene created");
    this.dim = this.add.rectangle(
      0,
      0,
      this.cameras.default.width,
      this.cameras.default.height,
      0x000000
    );
    this.dim.setOrigin(0, 0);
    this.dim.setAlpha(0);
    this.add.tween({
      targets: this.dim,
      duration: 250,
      alpha: 0.7,
      onComplete: () => {
        this.add
          .text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "Well Done!\n\nAll Levels Completed.\n\nYou made it!",
            {
              fontSize: "48px",
              color: "#fff",
            }
          )
          .setOrigin(0.5);
      },
    });
  }

  fadeOutThen(cb: () => void): void {
    this.add.tween({
      targets: this.dim,
      duration: 250,
      alpha: 0,
      onComplete: () => {
        this.scene.stop(this);
        cb();
      },
    });
  }
}
