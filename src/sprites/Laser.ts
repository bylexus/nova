import { EVENTS } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import LaserHead from "./LaserHead";

export default abstract class Laser extends Phaser.GameObjects.TileSprite {
  protected laserHeadCollider: Phaser.Physics.Arcade.Collider | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    textureKey: string,
    frameKey?: string | number
  ) {
    super(scene, x, y, width, height, textureKey, frameKey);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).syncBounds = true;

    const bloomFx = this.postFX.addBloom(0xffffffff, 0.5, 0.5, 1, 1);
    this.scene.tweens.add({
      targets: bloomFx,
      blurStrength: 2,
      strength: 0.5,
      yoyo: true,
      repeat: -1,
      duration: 500,
    });
  }

  public abstract get direction(): LaserDirection;

  public configureLaserHeadCollider(laserHeadGroup: Phaser.GameObjects.Group) {
    if (this.laserHeadCollider) {
      return;
    }
    this.laserHeadCollider = this.scene.physics.add.overlap(
      laserHeadGroup,
      this,
      (laserHead) => {
        // this.addSeenLaserHead(laserHead as LaserHead);
        this.overlapLaserHeadCallback(laserHead as LaserHead);
      },
      (laserHead) => {
        if (laserHead instanceof LaserHead) {
          if (!laserHead.active) {
            return false;
          }
          // if this beam is the last or 2nd last beam of the collided head,
          // we ignore it: the last 2 beams cannot be coliding with the head
          if (
            laserHead.tailBeams[laserHead.tailBeams.length - 1] === this ||
            laserHead.tailBeams[laserHead.tailBeams.length - 2] === this
          ) {
            return false;
          }
        }
        return true;
      }
    );
  }

  /**
   * This method is called when a non-seen laser head overlap occurs:
   * As soon as a laser head touches another laser, a single overlap event is triggered,
   * and the laser head is marked as "already seen". So the overlapLaserCallback is
   * only executed once per laser head.
   *
   * @param laserHead The laser head that enters this block's collider zone
   */
  protected overlapLaserHeadCallback(laserHead: LaserHead) {
    this.scene.events.emit(EVENTS.laserHit, laserHead, this);
  }

  public removeLaserCollider() {
    if (this.laserHeadCollider) {
      this.laserHeadCollider.destroy();
      this.laserHeadCollider = null;
    }
  }
}
