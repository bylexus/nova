import { EVENTS, GAME_IMAGES } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class BlockingBlock extends Block {
  public blockClass = "BlockingBlock";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_IMAGES.block.key);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      this.scene.events.emit(EVENTS.blockHit, this, laserHead);
    }
  }
}
