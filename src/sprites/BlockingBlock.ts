import { EVENTS, GAME_ASSETS } from "../Constants";
import Block from "./Block";
import Laser from "./Laser";

export default class BlockingBlock extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_ASSETS.block.key);
  }

  protected overlapLaserCallback(laser: Laser) {
    if (laser instanceof Laser) {
      this.scene.events.emit(EVENTS.blockHit, this, laser);
    }
  }
}
