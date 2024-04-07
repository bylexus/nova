import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class BlockingBlock extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, 0);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      this.scene.events.emit(EVENTS.blockHit, this, laserHead);
    }
  }
}
