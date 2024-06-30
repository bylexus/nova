import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import GameEndScene from "./scenes/GameEndScene";
import AllLevelsDoneScene from "./scenes/AllLevelsDoneScene";
import { PreloaderScene } from "./scenes/PreloaderScene";

const audioContext = new AudioContext();

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
      scale: {
        mode: Phaser.Scale.FIT,
      },
      audio: {
        context: audioContext,
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

    this.scene.add("PreloadScene", PreloaderScene, true);
    this.scene.add("GameScene", GameScene, false);
    this.scene.add("GameEndScene", GameEndScene, false);
    this.scene.add("AllLevelsDoneScene", AllLevelsDoneScene, false);
  }
}
