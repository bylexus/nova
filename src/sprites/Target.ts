import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import Laser from "./Laser";

const DirectionFrameMap = {
  up: 12,
  right: 13,
  down: 14,
  left: 15,
};

export default class Target extends Block {
  public laserInTarget: boolean = false;
  protected direction: "up" | "down" | "left" | "right";

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
      if (
        (this.direction === "up" && laser.direction === "down") ||
        (this.direction === "down" && laser.direction === "up") ||
        (this.direction === "left" && laser.direction === "right") ||
        (this.direction === "right" && laser.direction === "left")
      ) {
        this.laserInTarget = true;
        this.scene.events.emit(EVENTS.targetReached, this, laser);
      } else {
        this.scene.events.emit(EVENTS.blockHit, this, laser);
      }
    }
  }
}
