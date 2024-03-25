import { EVENTS, LASER_GROW_SPEED } from "../Constants";

export enum LaserDirection {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

export default abstract class Laser extends Phaser.GameObjects.TileSprite {
  protected seenLasers: Set<Laser> = new Set();
  protected laserCollider: Phaser.Physics.Arcade.Collider | null = null;

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
  }

  public abstract grow(amount: number): void;
  public abstract get direction(): LaserDirection;

  protected preUpdate(time: number, delta: number) {
    if (!this.active) {
      return;
    }

    let grow = (LASER_GROW_SPEED * delta) / 1000;
    this.grow(grow);
  }

  public configureLaserCollider(laserGroup: Phaser.GameObjects.Group) {
	if (this.laserCollider) {
		return;
	}
    this.laserCollider = this.scene.physics.add.overlap(
      laserGroup,
      this,
      (laser) => {
        this.addSeenLaser(laser as Laser);
        this.overlapLaserCallback(laser as Laser);
      },
      (laser) => {
        return this.seenLasers.has(laser as Laser) !== true;
      }
    );
  }

  /**
   * This method is called when a non-seen laser overlap occurs:
   * As soon as a laser touches another laser, a single overlap event is triggered,
   * and the laser is marked as "already seen". So the overlapLaserCallback is
   * only executed once per laser.
   *
   * @param laser The laser that enters this block's collider zone
   */
  protected overlapLaserCallback(laser: Laser) {
    console.log("Collided into other laser", laser.active);
    this.setActive(false);
    this.emit(EVENTS.blockHit, this, laser);
  }

  public addSeenLaser(laser: Laser) {
    this.seenLasers.add(laser);
  }

  public removeLaserCollider() {
    if (this.laserCollider) {
      this.laserCollider.destroy();
      this.laserCollider = null;
    }
  }
}
