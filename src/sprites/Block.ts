import LaserHead from "./LaserHead";

export default class Block extends Phaser.Physics.Arcade.Sprite {
  protected seenLaserHeads: Set<LaserHead> = new Set();

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

  public configureLaserHeadCollider(laserHeadGroup: Phaser.GameObjects.Group) {
    this.scene.physics.add.overlap(
      laserHeadGroup,
      this,
      (laserHead) => {
        if (laserHead instanceof LaserHead) {
          this.addSeenLaserHead(laserHead);
          this.overlapLaserCallback(laserHead);
        }
      },
      (laserHead) => this.seenLaserHeads.has(laserHead as LaserHead) !== true
    );
  }

  /**
   * This method is called when a non-seen laser head overlap occurs:
   * As soon as a laser head enters a block, a single overlap event is triggered,
   * and the laser head is marked as "already seen". So the overlapLaserCallback is
   * only executed once per laser head.
   *
   * @param laserHead The laser head that enters this block's collider zone
   */
  protected overlapLaserCallback(_laserHead: LaserHead) {
    // implement in child classes
  }

  public addSeenLaserHead(laserHead: LaserHead) {
    this.seenLaserHeads.add(laserHead);
  }
}
