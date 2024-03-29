import { GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import Laser from "./Laser";

export default class Cross extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, 1);
  }

  protected overlapLaserCallback(laser: Laser) {
    if (laser instanceof Laser) {
      // pass
    }
  }
}
