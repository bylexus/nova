import { EVENTS, GAME_IMAGES, TEXTURE_ATLAS } from "../Constants";
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
    switch (direction) {
      case LaserDirection.RIGHT:
        this.setAngle(0);
        break;
      case LaserDirection.DOWN:
        this.setAngle(90);
        break;
      case LaserDirection.LEFT:
        this.setAngle(180);
        break;
      case LaserDirection.UP:
        this.setAngle(270);
        break;
    }
    

    if (!this.scene.anims.exists("laser-right")) {
      this.scene.anims.create({
        key: "laser-right",
        frames: TEXTURE_ATLAS.laserRight.key,
        frameRate: 12,
        repeat: -1,
        yoyo: true,
        repeatDelay: 250
      });
    }

    this.play("laser-right");
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      this.scene.events.emit(EVENTS.blockHit, this, laserHead);
    }
  }
}
