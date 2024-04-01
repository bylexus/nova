export default class GameEndScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameEndScene",
    });
  }

  init() {}

  preload() {}

  create(data: { text: string; doneCallback: () => void }) {
    console.log("game end scene created", data);
    const dim = this.add.rectangle(
      0,
      0,
      this.cameras.default.width,
      this.cameras.default.height,
      0x000000
    );
    dim.setOrigin(0, 0);
    dim.setAlpha(0);
    this.add.tween({
      targets: dim,
      duration: 250,
      alpha: 0.7,
      onComplete: () => {
        this.add.text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          data.text,
          {
            fontSize: "32px",
            color: "#fff",
          }
        ).setOrigin(0.5);
      },
    });
  }
}
