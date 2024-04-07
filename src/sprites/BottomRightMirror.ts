import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class BottomRightMirror extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, 4);

    // physics body is half the size of the sprite, to collide ad the center of the triangle's
    // hypotheneus
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.width / 2 + 1,
      this.height / 2 + 1
    );
    (this.body as Phaser.Physics.Arcade.Body).setOffset(0, 0);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      // vertical lasers can only pass if coming from bottom (heading up):
      if (laserHead.direction === LaserDirection.UP) {
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
