import { GAME_ASSETS } from "../Constants";
import Block from "./Block";
import Laser from "./Laser";

export default class Cross extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_ASSETS.cross.key);
  }

  protected overlapLaserCallback(laser: Laser) {
    if (laser instanceof Laser) {
      // pass
    }
  }
}
