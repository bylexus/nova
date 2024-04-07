import GameEndStatus, { getGameEndStatusText } from "../lib/GameEndStatus";

export default class GameEndScene extends Phaser.Scene {
  protected dim: Phaser.GameObjects.Rectangle | null = null;

  constructor() {
    super({
      key: "GameEndScene",
    });
  }

  init() {}

  preload() {}

  create(data: {
    status: GameEndStatus;
    restartCallback?: () => void;
    nextLevelCallback?: () => void;
  }) {
    console.log("game end scene created", data);
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
            getGameEndStatusText(data.status),
            {
              fontSize: "32px",
              color: "#fff",
            }
          )
          .setOrigin(0.5);

        const btnRestart = this.add.dom(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 50,
          "button",
          "background-color: red; color:white",
          "restart"
        );
        btnRestart.addListener("click");
        btnRestart.on("click", () => {
          this.fadeOutThen(
            data.restartCallback ? data.restartCallback : () => {}
          );
        });
        if (data.status === GameEndStatus.WON) {
          const btnNext = this.add.dom(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 90,
            "button",
            "background-color: #080; color:white",
            "next level"
          );
          btnNext.addListener("click");
          btnNext.on("click", () => {
            this.fadeOutThen(
              data.nextLevelCallback ? data.nextLevelCallback : () => {}
            );
          });
        }
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
