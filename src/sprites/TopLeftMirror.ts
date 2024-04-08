import { EVENTS, GAME_IMAGES } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class TopLeftMirror extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_IMAGES.mirrorTL.key);

    // physics body is half the size of the sprite, to collide ad the center of the triangle's
    // hypotheneus
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.width / 2 + 1,
      this.height / 2 + 1
    );
    (this.body as Phaser.Physics.Arcade.Body).setOffset(
      this.width / 2,
      this.height / 2
    );
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      // vertical lasers can only pass if coming from top (heading down):
      if (laserHead.direction === LaserDirection.DOWN) {
        this.scene.events.emit(
          EVENTS.dirChange,
          LaserDirection.LEFT,
          this,
          laserHead
        );
      }
      // horizontal lasers can only pass if coming from left (heading right):
      else if (laserHead.direction === LaserDirection.RIGHT) {
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
