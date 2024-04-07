import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class BallMirror extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, 2);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    this.scene.events.emit(EVENTS.mirrorBallHit, this, laserHead);
  }
}
