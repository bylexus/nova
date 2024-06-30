import { EVENTS, GAME_IMAGES } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class BottomLeftMirror extends Block {
  public blockClass = "BottomLeftMirror";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_IMAGES.mirrorBL.key);

    // physics body is half the size of the sprite, to collide ad the center of the triangle's
    // hypotheneus
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.width / 2 + 1,
      this.height / 2 + 1
    );
    (this.body as Phaser.Physics.Arcade.Body).setOffset(this.width / 2, 0);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      // vertical lasers can only pass if coming from bottom (heading up):
      if (laserHead.direction === LaserDirection.UP) {
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
          LaserDirection.DOWN,
          this,
          laserHead
        );
      } else {
        this.scene.events.emit(EVENTS.blockHit, this, laserHead);
      }
    }
  }
}
