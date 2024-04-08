import { EVENTS, GAME_IMAGES } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

const DirectionImgMap = {
  [LaserDirection.UP]: GAME_IMAGES.laserUp,
  [LaserDirection.RIGHT]: GAME_IMAGES.laserRight,
  [LaserDirection.LEFT]: GAME_IMAGES.laserLeft,
  [LaserDirection.DOWN]: GAME_IMAGES.laserDown,
};
export default class LaserCannon extends Block {
  public direction: LaserDirection;

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
      this.scene.events.emit(EVENTS.blockHit, this, laserHead);
    }
  }
}
