import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

const DirectionFrameMap = {
  up: 11,
  right: 10,
  left: 9,
  down: 8,
};
export default class LaserCannon extends Block {
  public direction: LaserDirection;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection
  ) {
    const frame = DirectionFrameMap[direction];
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, frame);
    this.direction = direction;
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      this.scene.events.emit(EVENTS.blockHit, this, laserHead);
    }
  }
}
