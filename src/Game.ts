import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import GameEndScene from "./scenes/GameEndScene";
import { LEVELS } from "./Constants";
import AllLevelsDoneScene from "./scenes/AllLevelsDoneScene";

export class NovaGame extends Game {
  constructor() {
    super({
      parent: "app",
      dom: {
        createContainer: true,
      },
      width: 1024,
      height: 768,
      type: Phaser.AUTO,
      title: "Nova",
      // scene: [GameScene, GameEndScene],
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

    this.scene.add("GameScene", GameScene, true, {
      level: LEVELS[0]
    });
    this.scene.add("GameEndScene", GameEndScene, false);
    this.scene.add("AllLevelsDoneScene", AllLevelsDoneScene, false);
  }
}
