import { EVENTS, GAME_ASSETS } from "../Constants";
import Block from "./Block";
import HLaser from "./HLaser";
import Laser, { LaserDirection } from "./Laser";
import VLaser from "./VLaser";

export default class BottomRightMirror extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_ASSETS.mirrorBR.key);

    // physics body is half the size of the sprite, to collide ad the center of the triangle's
    // hypotheneus
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.width / 2,
      this.height / 2
    );
    (this.body as Phaser.Physics.Arcade.Body).setOffset(0, 0);
  }

  protected overlapLaserCallback(laser: Laser) {
    if (laser instanceof VLaser) {
      // vertical lasers can only pass if coming from bottom (heading up):
      if (laser.direction === LaserDirection.UP) {
        this.emit(EVENTS.dirChange, LaserDirection.RIGHT, this);
      } else {
        laser.setActive(false);
        this.emit(EVENTS.blockHit, this);
      }
    } else if (laser instanceof HLaser) {
      // horizontal lasers can only pass if coming from right (heading left):
      if (laser.direction === LaserDirection.LEFT) {
        this.emit(EVENTS.dirChange, LaserDirection.DOWN, this);
      } else {
        laser.setActive(false);
        this.emit(EVENTS.blockHit, this);
      }
    }
  }
}
