import { EVENTS, GAME_ASSETS } from "../Constants";
import Block from "./Block";
import HLaser from "./HLaser";
import Laser, { LaserDirection } from "./Laser";
import VLaser from "./VLaser";

export default class TopLeftMirror extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_ASSETS.mirrorTL.key);

    // physics body is half the size of the sprite, to collide ad the center of the triangle's
    // hypotheneus
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.width / 2,
      this.height / 2
    );
    (this.body as Phaser.Physics.Arcade.Body).setOffset(
      this.width / 2,
      this.height / 2
    );
  }

  protected overlapLaserCallback(laser: Laser) {
    if (laser instanceof VLaser) {
      // vertical lasers can only pass if coming from top (heading down):
      if (laser.direction === LaserDirection.DOWN) {
        this.emit(EVENTS.dirChange, LaserDirection.LEFT, this);
      } else {
        laser.setActive(false);
        this.emit(EVENTS.blockHit, this);
      }
    } else if (laser instanceof HLaser) {
      // horizontal lasers can only pass if coming from left (heading right):
      if (laser.direction === LaserDirection.RIGHT) {
        this.emit(EVENTS.dirChange, LaserDirection.UP, this);
      } else {
        laser.setActive(false);
        this.emit(EVENTS.blockHit, this);
      }
    }
  }
}
