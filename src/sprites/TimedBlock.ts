import { GAME_IMAGES, LASER_GROW_SPEED } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class TimedBlock extends Block {
  public blockClass = "TimedBlock";
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_IMAGES.timedBlock.key);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    console.log("TODO: TimedBlock.overlapLaserCallback");
    if (laserHead instanceof LaserHead) {
      // slow down / stop laserHead for an amount of time:
      laserHead.stopMoving();
      const fadeOutTween = this.scene.add.tween({
        alpha: 0.4,
        targets: this,
        duration: 49500 / LASER_GROW_SPEED,
      });
      this.scene.time.delayedCall(49500 / LASER_GROW_SPEED, () => {
        laserHead.startMoving();
        fadeOutTween.destroy();
        this.destroy();
      });
    }
  }
}
