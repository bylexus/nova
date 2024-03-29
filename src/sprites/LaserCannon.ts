import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import Laser from "./Laser";

const DirectionFrameMap = {
  up: 11,
  right: 10,
  left: 9,
  down: 8,
};
export default class LaserCannon extends Block {
  public direction: "up" | "down" | "left" | "right";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: "up" | "down" | "left" | "right"
  ) {
    const frame = DirectionFrameMap[direction];
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, frame);
    this.direction = direction;
  }

  protected overlapLaserCallback(laser: Laser) {
    if (laser instanceof Laser) {
      this.scene.events.emit(EVENTS.blockHit, this, laser);
    }
  }
}
