import { EVENTS, GAME_IMAGES } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class TopRightMirror extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_IMAGES.mirrorTR.key);

    // physics body is half the size of the sprite, to collide ad the center of the triangle's
    // hypotheneus
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.width / 2 + 1,
      this.height / 2 + 1
    );
    (this.body as Phaser.Physics.Arcade.Body).setOffset(0, this.height / 2);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    console.log("TopRightMirror: overlapLaserCallback");
    if (laserHead instanceof LaserHead) {
      // vertical lasers can only pass if coming from top (heading down):
      if (laserHead.direction === LaserDirection.DOWN) {
        this.scene.events.emit(
          EVENTS.dirChange,
          LaserDirection.RIGHT,
          this,
          laserHead
        );
      }
      // horizontal lasers can only pass if coming from right (heading left):
      else if (laserHead.direction === LaserDirection.LEFT) {
        this.scene.events.emit(
          EVENTS.dirChange,
          LaserDirection.UP,
          this,
          laserHead
        );
      } else {
        this.scene.events.emit(EVENTS.blockHit, this, laserHead);
      }
    }
  }
}
