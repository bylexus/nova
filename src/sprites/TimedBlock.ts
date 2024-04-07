import { GAME_SPRITESHEETS } from "../Constants";
import Block from "./Block";
import LaserHead from "./LaserHead";

export default class TimedBlock extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GAME_SPRITESHEETS.spritesheet.key, 7);
  }

  protected overlapLaserCallback(laserHead: LaserHead) {
    console.log('TODO: TimedBlock.overlapLaserCallback');
    if (laserHead instanceof LaserHead) {
      // slow down / stop laserHead for an amount of time:
      laserHead.stopMoving();
      const fadeOutTween = this.scene.add.tween({
        alpha: 0.4,
        targets: this,
        duration: 500
      });
      this.scene.time.delayedCall(500, () => {
        laserHead.startMoving()
        fadeOutTween.destroy();
        this.destroy();
      });
    }
  }
}
