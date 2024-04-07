import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import GameEndScene from "./scenes/GameEndScene";

export class NovaGame extends Game {
  constructor() {
    super({
      width: 1024,
      height: 768,
      type: Phaser.AUTO,
      title: "Nova",
      scene: [GameScene, GameEndScene],
      scale: {
        mode: Phaser.Scale.FIT,
      },
      audio: {
        // context: new AudioContext(),
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          // debug: true,
          gravity: { x: 0, y: 0 },
        },
      },
    });
  }
}
