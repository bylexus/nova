import { GAME_ASSETS } from "../Constants";
import Block from "./Block";
import Laser from "./Laser";

export default class TimedBlock extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_ASSETS.timedblock.key);
  }

  protected overlapLaserCallback(laser: Laser) {
    if (laser instanceof Laser) {
      // slow down / stop laser for an amount of time:
      laser.growFactor = 0;
      this.scene.time.delayedCall(500, () => {
        laser.growFactor = 1;
        this.destroy();
      });
    }
  }
}