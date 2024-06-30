import { GAME_IMAGES } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class ForbiddenBlock extends Block {
  public blockClass = "ForbiddenBlock";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_IMAGES.forbiddenBlock.key);
  }

  protected overlapLaserCallback(_laserHead: LaserHead) {
    // pass - laser can travel through
  }
}
