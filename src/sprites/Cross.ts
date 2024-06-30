import { GAME_IMAGES } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class Cross extends Block {
  public blockClass = "Cross";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_IMAGES.cross.key);
  }

  protected overlapLaserCallback(_laserHead: LaserHead) {
    // pass
  }
}
