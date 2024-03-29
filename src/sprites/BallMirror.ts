import { EVENTS, GAME_IMAGES, GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import Laser from "./Laser";

export default class BallMirror extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, 2);
  }

  protected overlapLaserCallback(laser: Laser) {
    this.scene.events.emit(EVENTS.mirrorBallHit, this, laser);
  }
}
