import { EVENTS, GAME_IMAGES } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

const DirectionImgMap = {
  [LaserDirection.UP]: GAME_IMAGES.targetUp,
  [LaserDirection.RIGHT]: GAME_IMAGES.targetRight,
  [LaserDirection.DOWN]: GAME_IMAGES.targetDown,
  [LaserDirection.LEFT]: GAME_IMAGES.targetLeft,
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
    const img = DirectionImgMap[direction];
    super(scene, x, y, img.key);
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
