import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

const DirectionFrameMap = {
  [LaserDirection.UP]: 12,
  [LaserDirection.RIGHT]: 13,
  [LaserDirection.DOWN]: 14,
  [LaserDirection.LEFT]: 15,
};

export default class Target extends Block {
  public laserInTarget: boolean = false;
  protected direction: LaserDirection;

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
      if (
        (this.direction === LaserDirection.UP &&
          laserHead.direction === LaserDirection.DOWN) ||
        (this.direction === LaserDirection.DOWN &&
          laserHead.direction === LaserDirection.UP) ||
        (this.direction === LaserDirection.LEFT &&
          laserHead.direction === LaserDirection.RIGHT) ||
        (this.direction === LaserDirection.RIGHT &&
          laserHead.direction === LaserDirection.LEFT)
      ) {
        this.laserInTarget = true;
        this.scene.events.emit(EVENTS.targetReached, this, laserHead);
      } else {
        this.scene.events.emit(EVENTS.blockHit, this, laserHead);
      }
    }
  }
}
