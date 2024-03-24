import Laser from "./Laser";

export default class Block extends Phaser.Physics.Arcade.Sprite {
  protected seenLasers: Set<Laser> = new Set();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  public configureLaserCollider(laserGroup: Phaser.GameObjects.Group) {
    this.scene.physics.add.overlap(
      laserGroup,
      this,
      (laser) => {
        this.addSeenLaser(laser as Laser);
        this.overlapLaserCallback(laser as Laser);
      },
      (laser) => this.seenLasers.has(laser as Laser) !== true
    );
  }

  /**
   * This method is called when a non-seen laser overlap occurs:
   * As soon as a laser enters a block, a single overlap event is triggered,
   * and the laser is marked as "already seen". So the overlapLaserCallback is
   * only executed once per laser.
   * 
   * @param laser The laser that enters this block's collider zone
   */
  protected overlapLaserCallback(laser: Laser) {}

  public addSeenLaser(laser: Laser) {
    this.seenLasers.add(laser);
  }
}
