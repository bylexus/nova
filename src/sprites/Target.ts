import { EVENTS, GAME_SPRITESHEETS } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class Target extends Block {
  public blockClass = "Target";

  public laserInTarget: boolean = false;
  protected direction: LaserDirection;
  protected shineFx: Phaser.FX.Shine;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection
  ) {
    super(scene, x, y, GAME_SPRITESHEETS.target.key, 0);
    this.direction = direction;
    switch (direction) {
      case LaserDirection.RIGHT:
        this.setAngle(0);
        break;
      case LaserDirection.DOWN:
        this.setAngle(90);
        break;
      case LaserDirection.LEFT:
        this.setAngle(180);
        break;
      case LaserDirection.UP:
        this.setAngle(270);
        break;
    }

    this.shineFx = this.postFX.addShine(1, 1, 3);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    if (laserHead instanceof LaserHead) {
      if (
        (this.direction === LaserDirection.UP &&
          laserHead.direction === LaserDirection.DOWN) ||
        (this.direction === LaserDirection.DOWN &&
          laserHead.direction === LaserDirection.UP) ||
        (this.direction === LaserDirection.LEFT &&
          laserHead.direction === LaserDirection.RIGHT) ||
        (this.direction === LaserDirection.RIGHT &&
          laserHead.direction === LaserDirection.LEFT)
      ) {
        this.laserInTarget = true;
        this.scene.events.emit(EVENTS.targetReached, this, laserHead);
        this.setFrame(1);
        this.postFX.remove(this.shineFx);
        this.postFX.addGlow(0x88ff88, 5);
      } else {
        this.scene.events.emit(EVENTS.blockHit, this, laserHead);
      }
    }
  }
}
