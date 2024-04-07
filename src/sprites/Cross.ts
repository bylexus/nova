import { GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class Cross extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, 1);
  }

  protected overlapLaserCallback(_laserHead: LaserHead) {
    // pass
  }
}
