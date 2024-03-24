import { Game } from "phaser";
import { MainScene } from "./scenes/MainScene";

export class NovaGame extends Game {
  constructor() {
    super({
      width: 1024,
      height: 768,
      type: Phaser.AUTO,
      title: "Nova",
      scene: MainScene,
      scale: {
        mode: Phaser.Scale.FIT,
      },
      physics: {
        default: "arcade",
        arcade: {
        //   debug: false,
            debug: true,
          gravity: { x: 0, y: 0 },
        },
      },
    });
  }
}
